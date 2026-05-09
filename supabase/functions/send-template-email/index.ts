import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface Attachment {
  filename: string;
  content_base64: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json();
    const {
      branding_id,
      verkaeufer_id,
      to,
      subject,
      html,
      attachments,
      anfrage_id,
      template,
    } = body ?? {};

    if (!branding_id || !verkaeufer_id || !to || !subject || !html) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [brandingRes, verkaeuferRes] = await Promise.all([
      supabase.from("brandings").select("name, resend_api_key").eq("id", branding_id).maybeSingle(),
      supabase.from("verkaeufer").select("vorname, nachname, email").eq("id", verkaeufer_id).maybeSingle(),
    ]);

    if (brandingRes.error || !brandingRes.data) {
      return new Response(JSON.stringify({ error: "branding not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (verkaeuferRes.error || !verkaeuferRes.data) {
      return new Response(JSON.stringify({ error: "verkaeufer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const branding = brandingRes.data;
    const verkaeufer = verkaeuferRes.data;

    if (!branding.resend_api_key) {
      return new Response(JSON.stringify({ error: "Branding has no Resend API key" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!verkaeufer.email) {
      return new Response(JSON.stringify({ error: "Verkäufer has no email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderName = `${verkaeufer.vorname} ${verkaeufer.nachname} - ${branding.name}`;
    const fromHeader = `${senderName} <${verkaeufer.email}>`;

    const resendPayload: Record<string, unknown> = {
      from: fromHeader,
      to: [to],
      subject,
      html,
      reply_to: verkaeufer.email,
    };

    if (Array.isArray(attachments) && attachments.length > 0) {
      resendPayload.attachments = (attachments as Attachment[]).map((a) => ({
        filename: a.filename,
        content: a.content_base64,
      }));
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${branding.resend_api_key}`,
      },
      body: JSON.stringify(resendPayload),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      await supabase.from("aktivitaets_log").insert({
        anfrage_id: anfrage_id ?? null,
        aktion: "Email fehlgeschlagen",
        details: `An ${to} via ${verkaeufer.email} — ${JSON.stringify(resendData).slice(0, 400)}`,
        user_email: "system",
      });
      return new Response(
        JSON.stringify({ error: "Email sending failed", details: resendData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    await supabase.from("aktivitaets_log").insert({
      anfrage_id: anfrage_id ?? null,
      aktion: "Email gesendet",
      details: `${subject} — an ${to} von ${verkaeufer.email}`,
      user_email: "system",
    });

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-template-email error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
