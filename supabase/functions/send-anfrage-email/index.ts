import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateAnfrageEmail(
  branding: { name: string; strasse: string; plz: string; stadt: string; amtsgericht: string; handelsregister: string; geschaeftsfuehrer: string; ust_id: string; email_logo_url?: string | null; footer_unternehmensname?: string | null },
  fahrzeug: { fahrzeugname: string; preis: number; erstzulassung?: string | null; km_stand?: number | null; kraftstoff?: string | null; ps?: number | null; kw?: number | null }
): string {
  const preis = Number(fahrzeug.preis).toLocaleString("de-DE", { minimumFractionDigits: 0 });
  const km = fahrzeug.km_stand ? Number(fahrzeug.km_stand).toLocaleString("de-DE") : "–";

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
    <tr><td align="center" style="padding:30px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e0e0e0;">
        <tr><td style="background:#000000;padding:30px 40px;text-align:center;">
          ${branding.email_logo_url ? `<img src="${branding.email_logo_url}" alt="${branding.name}" style="max-height:50px;max-width:200px;height:auto;display:inline-block;" />` : `<span style="color:#fff;font-size:18px;font-weight:600;letter-spacing:2px;">${branding.name}</span>`}
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="font-size:22px;font-weight:bold;color:#000;margin:0 0 20px;">Vielen Dank für Ihre Anfrage</h1>
          <p style="font-size:14px;line-height:1.6;margin:0 0 15px;">Sehr geehrte Kundin, sehr geehrter Kunde,</p>
          <p style="font-size:14px;line-height:1.6;margin:0 0 25px;">wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;margin-bottom:25px;">
            <tr><td style="background:#f8f8f8;padding:15px 20px;border-bottom:1px solid #e0e0e0;">
              <strong style="font-size:14px;color:#000;">Ihr ausgewähltes Fahrzeug</strong>
            </td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-size:16px;font-weight:bold;color:#000;padding-bottom:12px;">${fahrzeug.fahrzeugname}</td></tr>
                <tr><td style="padding-bottom:8px;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="font-size:13px;color:#666;width:100px;">Preis:</td>
                    <td style="font-size:13px;font-weight:bold;color:#000;">${preis} €</td>
                  </tr></table>
                </td></tr>
                ${fahrzeug.erstzulassung ? `<tr><td style="padding-bottom:8px;"><table cellpadding="0" cellspacing="0"><tr><td style="font-size:13px;color:#666;width:100px;">EZ:</td><td style="font-size:13px;color:#000;">${fahrzeug.erstzulassung}</td></tr></table></td></tr>` : ""}
                <tr><td style="padding-bottom:8px;"><table cellpadding="0" cellspacing="0"><tr><td style="font-size:13px;color:#666;width:100px;">Kilometerstand:</td><td style="font-size:13px;color:#000;">${km} km</td></tr></table></td></tr>
                ${fahrzeug.kraftstoff ? `<tr><td style="padding-bottom:8px;"><table cellpadding="0" cellspacing="0"><tr><td style="font-size:13px;color:#666;width:100px;">Kraftstoff:</td><td style="font-size:13px;color:#000;">${fahrzeug.kraftstoff}</td></tr></table></td></tr>` : ""}
                ${fahrzeug.ps ? `<tr><td><table cellpadding="0" cellspacing="0"><tr><td style="font-size:13px;color:#666;width:100px;">Leistung:</td><td style="font-size:13px;color:#000;">${fahrzeug.ps} PS (${fahrzeug.kw} kW)</td></tr></table></td></tr>` : ""}
              </table>
            </td></tr>
          </table>
          <p style="font-size:14px;line-height:1.6;margin:0 0 10px;">Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
          <p style="font-size:14px;line-height:1.6;margin:0;">Mit freundlichen Grüßen<br/><strong>${branding.name}</strong></p>
        </td></tr>
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"/></td></tr>
        <tr><td style="padding:20px 40px 10px;text-align:left;">
          <p style="font-size:12px;color:#999;margin:0;letter-spacing:0.5px;">Vertriebssystem — Ein Service der ${branding.footer_unternehmensname || branding.name}</p>
        </td></tr>
        <tr><td style="padding:10px 40px 30px;">
          <p style="font-size:11px;color:#999;line-height:1.5;margin:0;text-align:left;">
            ${branding.name}<br/>
            ${branding.strasse}, ${branding.plz} ${branding.stadt}<br/><br/>
            ${branding.amtsgericht} · ${branding.handelsregister}<br/>
            Geschäftsführer: ${branding.geschaeftsfuehrer}<br/>
            USt-IdNr.: ${branding.ust_id}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { branding_id, fahrzeug_id, kunde_email, kunde_name, kunde_telefon } = await req.json();

    if (!branding_id || !fahrzeug_id || !kunde_email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const [brandingRes, fahrzeugRes] = await Promise.all([
      supabase.from("brandings").select("*").eq("id", branding_id).single(),
      supabase.from("fahrzeuge").select("*").eq("id", fahrzeug_id).single(),
    ]);

    if (brandingRes.error || !brandingRes.data) {
      return new Response(JSON.stringify({ error: "Branding not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (fahrzeugRes.error || !fahrzeugRes.data) {
      return new Response(JSON.stringify({ error: "Fahrzeug not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const branding = brandingRes.data;
    const fahrzeug = fahrzeugRes.data;

    if (!branding.resend_api_key || !branding.email_absender) {
      return new Response(JSON.stringify({ error: "Branding has no email configuration" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = generateAnfrageEmail(branding, fahrzeug);
    const absendername = branding.absendername || branding.name;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${branding.resend_api_key}`,
      },
      body: JSON.stringify({
        from: `${absendername} <${branding.email_absender}>`,
        to: [kunde_email],
        subject: `Ihre Anfrage: ${fahrzeug.fahrzeugname}`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", resendData);
      return new Response(JSON.stringify({ error: "Email sending failed", details: resendData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Telegram notification ---
    try {
      const telegramToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
      if (telegramToken) {
        const { data: chatIds } = await supabase
          .from("telegram_chat_ids")
          .select("chat_id");

        if (chatIds && chatIds.length > 0) {
          const preis = Number(fahrzeug.preis).toLocaleString("de-DE", { minimumFractionDigits: 0 });
          const tgMessage = `🚗 <b>Neue Anfrage eingegangen!</b>\n\n<b>Name:</b> ${kunde_name || "–"}\n📞 ${kunde_telefon || "–"}\n📧 ${kunde_email}\n\n<b>Fahrzeug:</b> ${fahrzeug.fahrzeugname}\n<b>Preis:</b> ${preis} €`;

          await Promise.allSettled(
            chatIds.map((c: { chat_id: string }) =>
              fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id: c.chat_id, text: tgMessage, parse_mode: "HTML" }),
              })
            )
          );
        }
      }
    } catch (tgErr) {
      console.error("Telegram notification error:", tgErr);
    }

    return new Response(JSON.stringify({ success: true, id: resendData.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
