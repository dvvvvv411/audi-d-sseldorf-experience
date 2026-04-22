import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CLOAKER_WEBHOOK = "https://inboxabi.net/api/webhooks/kfz";
const WINDOW_MINUTES = 30;

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
  console.log("kfz-resolve: incoming request, ip =", ip);

  if (!ip) {
    return new Response(
      JSON.stringify({ success: true, redirectId: null, reason: "no_ip" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const sinceIso = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString();

  const { data: rows, error: selError } = await supabase
    .from("cloaker_redirects")
    .select("id, redirect_id, captcha_solved, created_at, ip_address")
    .eq("ip_address", ip)
    .eq("captcha_solved", false)
    .gte("created_at", sinceIso)
    .order("created_at", { ascending: false })
    .limit(1);

  if (selError) {
    console.error("kfz-resolve select error:", selError);
    return new Response(
      JSON.stringify({ success: false, error: "Database error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const match = rows?.[0];
  if (!match) {
    console.log("kfz-resolve: no match for ip", ip);
    return new Response(
      JSON.stringify({ success: true, redirectId: null }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const redirectId = match.redirect_id;
  console.log("kfz-resolve: matched redirectId =", redirectId);

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
    console.log("kfz-resolve: cloaker webhook status:", cloakerRes.status, cloakerText);
  } catch (e) {
    console.error("kfz-resolve: cloaker webhook fetch failed:", e);
  }

  return new Response(
    JSON.stringify({ success: true, redirectId }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
