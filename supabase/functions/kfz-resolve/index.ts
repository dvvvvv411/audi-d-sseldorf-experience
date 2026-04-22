import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CLOAKER_WEBHOOK = "https://inboxabi.net/api/webhooks/kfz";
const WINDOW_MINUTES = 30;
const UA_WINDOW_MINUTES = 10;

function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    null
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ip = getClientIp(req);
  const xff = req.headers.get("x-forwarded-for");
  const cfIp = req.headers.get("cf-connecting-ip");
  const realIp = req.headers.get("x-real-ip");

  // Read UA from body if provided (client UA), fallback to header
  let bodyUa: string | null = null;
  try {
    const body = await req.json();
    if (body && typeof body.userAgent === "string") bodyUa = body.userAgent;
  } catch {
    // ignore
  }
  const headerUa = req.headers.get("user-agent");
  const ua = bodyUa || headerUa || null;

  console.log("kfz-resolve: incoming", {
    ip,
    xff,
    cfIp,
    realIp,
    ua,
  });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const sinceIso = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();
  const sinceUaIso = new Date(Date.now() - UA_WINDOW_MINUTES * 60 * 1000).toISOString();

  let match:
    | { id: string; redirect_id: string; ip_address: string | null; user_agent: string | null }
    | null = null;
  let matchedBy: "ip" | "user_agent" | "none" = "none";

  // Stage A — exact IP match
  if (ip) {
    const { data, error } = await supabase
      .from("cloaker_redirects")
      .select("id, redirect_id, ip_address, user_agent")
      .eq("ip_address", ip)
      .eq("captcha_solved", false)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) console.error("kfz-resolve ip-select error:", error);
    if (data && data[0]) {
      match = data[0];
      matchedBy = "ip";
    }
  }

  // Stage B — User-Agent fallback (small window)
  if (!match && ua) {
    const { data, error } = await supabase
      .from("cloaker_redirects")
      .select("id, redirect_id, ip_address, user_agent")
      .eq("user_agent", ua)
      .eq("captcha_solved", false)
      .gte("created_at", sinceUaIso)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) console.error("kfz-resolve ua-select error:", error);
    if (data && data[0]) {
      match = data[0];
      matchedBy = "user_agent";
    }
  }

  if (!match) {
    console.log("kfz-resolve: no match", { ip, ua, matched_by: matchedBy });
    return new Response(
      JSON.stringify({ success: true, redirectId: null, matched_by: "none" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const redirectId = match.redirect_id;
  console.log("kfz-resolve: matched", { redirectId, matched_by: matchedBy });

  const { error: updError } = await supabase
    .from("cloaker_redirects")
    .update({
      captcha_solved: true,
      callback_sent_at: new Date().toISOString(),
    })
    .eq("id", match.id);

  if (updError) {
    console.error("kfz-resolve update error:", updError);
  }

  try {
    const cloakerRes = await fetch(CLOAKER_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ redirectId, captchaSolved: true }),
    });
    const cloakerText = await cloakerRes.text();
    console.log("kfz-resolve: cloaker webhook", cloakerRes.status, cloakerText);
  } catch (e) {
    console.error("kfz-resolve: cloaker webhook fetch failed:", e);
  }

  return new Response(
    JSON.stringify({ success: true, redirectId, matched_by: matchedBy }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
