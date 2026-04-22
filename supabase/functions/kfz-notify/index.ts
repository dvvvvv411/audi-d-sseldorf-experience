import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { z } from "https://esm.sh/zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BodySchema = z.object({
  redirectId: z.string().min(1).max(255),
  ipAddress: z.string().max(64).optional().nullable(),
  userAgent: z.string().max(2000).optional().nullable(),
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

  const { redirectId, ipAddress, userAgent } = parsed.data;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { error } = await supabase
    .from("cloaker_redirects")
    .upsert(
      {
        redirect_id: redirectId,
        ip_address: ipAddress ?? null,
        user_agent: userAgent ?? null,
      },
      { onConflict: "redirect_id" },
    );

  if (error) {
    console.error("kfz-notify insert error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Database error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  return new Response(
    JSON.stringify({ success: true, message: "Notification stored" }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
