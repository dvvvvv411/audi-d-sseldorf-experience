import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Normalize a phone number to E.164 format.
 * Default country: Germany (+49).
 *
 * Examples:
 *   "03771 159182"      -> "+493771159182"
 *   "+49 157 86502896"  -> "+4915786502896"
 *   "01723071207"       -> "+491723071207"
 *   "07544/9558990"     -> "+4975449558990"
 *   "0043 660 1234567"  -> "+436601234567"
 */
function normalizePhone(input: string): string | null {
  if (!input) return null;
  // 1. Keep only digits and a leading "+"
  const hasPlus = input.trim().startsWith("+");
  const digits = input.replace(/[^\d]/g, "");
  if (!digits) return null;

  let result: string;
  if (hasPlus) {
    result = "+" + digits;
  } else if (digits.startsWith("00")) {
    result = "+" + digits.slice(2);
  } else if (digits.startsWith("0")) {
    result = "+49" + digits.slice(1);
  } else {
    result = "+49" + digits;
  }

  // E.164: + followed by 8-15 digits
  if (!/^\+\d{8,15}$/.test(result)) return null;
  return result;
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
    const { branding_id, anfrage_id, telefon, vorname, verkaeufer_name } = body ?? {};

    if (!branding_id || !vorname || !verkaeufer_name) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load branding
    const { data: branding, error: bErr } = await supabase
      .from("brandings")
      .select("name, sevenio_api_key, sevenio_absendername")
      .eq("id", branding_id)
      .maybeSingle();

    if (bErr || !branding) {
      return new Response(JSON.stringify({ error: "branding not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!branding.sevenio_api_key) {
      return new Response(JSON.stringify({ skipped: "no_api_key" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const to = normalizePhone(String(telefon ?? ""));
    if (!to) {
      return new Response(JSON.stringify({ skipped: "invalid_phone" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const senderLabel = branding.sevenio_absendername || branding.name;
    const text = `Hallo ${vorname}, Ihre Anfrage ist bei uns eingegangen.\n${verkaeufer_name} wird sich zeitnah persönlich bei Ihnen melden.\n${senderLabel}`;

    // Build payload — `from` only if absendername is set and <= 11 chars
    const payload: Record<string, unknown> = { to, text };
    const fromValue = branding.sevenio_absendername ?? "";
    if (fromValue && fromValue.length <= 11) {
      payload.from = fromValue;
    }

    let status = "gesendet";
    let fehler: string | null = null;
    let sevenResponse: unknown = null;

    try {
      const resp = await fetch("https://gateway.seven.io/api/sms", {
        method: "POST",
        headers: {
          "X-Api-Key": branding.sevenio_api_key,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "SentWith": "Lovable",
        },
        body: JSON.stringify(payload),
      });
      const respText = await resp.text();
      try {
        sevenResponse = JSON.parse(respText);
      } catch {
        sevenResponse = { raw: respText };
      }

      const success = resp.ok &&
        (typeof sevenResponse === "object" && sevenResponse !== null &&
          // seven.io returns { success: "100", ... } on success or messages array
          ((sevenResponse as Record<string, unknown>).success === "100" ||
            Array.isArray((sevenResponse as Record<string, unknown>).messages)));

      if (!success) {
        status = "fehlgeschlagen";
        fehler = `HTTP ${resp.status}: ${respText.slice(0, 500)}`;
      }
    } catch (e) {
      status = "fehlgeschlagen";
      fehler = e instanceof Error ? e.message : String(e);
      sevenResponse = { error: fehler };
    }

    // Insert sms_verlauf
    await supabase.from("sms_verlauf").insert({
      anfrage_id: anfrage_id ?? null,
      branding_id,
      empfaenger: to,
      absender: payload.from ? String(payload.from) : null,
      text,
      status,
      fehler,
      seven_response: sevenResponse as never,
    });

    // Insert aktivitaets_log
    await supabase.from("aktivitaets_log").insert({
      anfrage_id: anfrage_id ?? null,
      aktion: status === "gesendet" ? "SMS gesendet" : "SMS fehlgeschlagen",
      details: status === "gesendet"
        ? `An ${to} via Seven.io`
        : `An ${to} — ${fehler ?? "unbekannter Fehler"}`,
      user_email: "system",
    });

    return new Response(JSON.stringify({ success: status === "gesendet", status, fehler }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-anfrage-sms error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
