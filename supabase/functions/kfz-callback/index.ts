import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CLOAKER_WEBHOOK = "https://inboxabi.net/api/webhooks/kfz";

const BodySchema = z.object({
  redirectId: z.string().min(1).max(255),
  captchaSolved: z.boolean().optional(),
  actionCreated: z.boolean().optional(),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const parsed = BodySchema.safeParse(payload);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ success: false, error: "redirectId is required" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { redirectId, captchaSolved, actionCreated } = parsed.data;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Existenzprüfung
  const { data: existing, error: selError } = await supabase
    .from("cloaker_redirects")
    .select("id, captcha_solved, action_created")
    .eq("redirect_id", redirectId)
    .maybeSingle();

  if (selError) {
    console.error("kfz-callback select error:", selError);
    return new Response(
      JSON.stringify({ success: false, error: "Database error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  if (!existing) {
    return new Response(
      JSON.stringify({ success: false, error: "Redirect ID not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const update: Record<string, unknown> = { callback_sent_at: new Date().toISOString() };
  if (typeof captchaSolved === "boolean") update.captcha_solved = captchaSolved || existing.captcha_solved;
  if (typeof actionCreated === "boolean") update.action_created = actionCreated || existing.action_created;

  const { error: updError } = await supabase
    .from("cloaker_redirects")
    .update(update)
    .eq("redirect_id", redirectId);

  if (updError) {
    console.error("kfz-callback update error:", updError);
  }

  // An Cloaker weiterleiten
  const cloakerBody: Record<string, unknown> = { redirectId };
  if (typeof captchaSolved === "boolean") cloakerBody.captchaSolved = captchaSolved;
  if (typeof actionCreated === "boolean") cloakerBody.actionCreated = actionCreated;

  try {
    const cloakerRes = await fetch(CLOAKER_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cloakerBody),
    });
    const cloakerText = await cloakerRes.text();
    console.log("Cloaker webhook response:", cloakerRes.status, cloakerText);
  } catch (e) {
    console.error("Cloaker webhook fetch failed:", e);
  }

  return new Response(
    JSON.stringify({ success: true, message: "Status updated successfully" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
