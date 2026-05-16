import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const SCHEMA = {
  type: "object",
  properties: {
    fahrzeugname: { type: "string", description: "Modellbezeichnung wie 'A6 40 TDI Q 2x S LINE' oder 'Caddy HYBRID LIFE' – die große Modell-Überschrift, NICHT der Händlername" },
    preis: { type: "number", description: "Barpreis in Euro als reine Zahl (Tausenderpunkte entfernen)" },
    farbe: { type: "string" },
    kw: { type: "number" },
    ps: { type: "number" },
    hubraum: { type: "number" },
    km_stand: { type: "number", description: "Reine Zahl ohne Punkte/Einheit, z.B. 12143" },
    kraftstoff: { type: "string", description: "Erster Teil von 'Motor/Antrieb', z.B. 'Diesel', 'Benzin', 'Hybrid-Plugin'" },
    getriebe: { type: "string", description: "Mittlerer Teil von 'Motor/Antrieb', z.B. 'Automatik', 'Schaltgetriebe'" },
    antrieb: { type: "string", description: "Letzter Teil von 'Motor/Antrieb' nach dem '/', z.B. 'Allradantrieb', 'Frontantrieb'" },
    innenausstattung: { type: "string", description: "Material/Bezug der Innenausstattung, z.B. 'Stoff', 'Leder'" },
    tueren: { type: "number" },
    sitze: { type: "number" },
    erstzulassung: { type: "string", description: "Format DD.MM.YYYY" },
    tuev_au: { type: "string", description: "Format MM.YYYY/MM.YYYY" },
    auftragsnummer: { type: "string", description: "5-8 stellige Zahl, steht hinter 'Auftragsnummer:'" },
    fahrgestellnummer: { type: "string" },
    beschreibung: { type: "string", description: "WÖRTLICHER Inhalt des Blocks 'Serien- und Sonderausstattung' inkl. aller '***' Trenner. Beginnt nach der Überschrift, endet vor dem Disclaimer 'Da wir uns Zwischenverkauf vorbehalten…' bzw. vor 'Barpreis:'. NICHT umformulieren, NICHT kürzen, alle Aufzählungen vollständig übernehmen." },
  },
  required: [],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `Du extrahierst Fahrzeugdaten aus deutschen Fahrzeug-Angebots-PDFs (Tiemeyer/SEG/easy-car-sales).

WICHTIG zum Layout:
- Der Block "Fahrzeugdaten:" kann zweispaltig (Label/Wert pro Zeile) ODER vierspaltig (Label|Wert | Label|Wert) sein.
- Ordne IMMER das Label dem Wert zu, der in derselben Zeile rechts neben dem Label steht (gleiche Y-Position, nächste X-Position rechts). Verwechsle keine Spalten.
- "Innenausstattung:" kann in der Kopfzeile der Tabelle oben rechts stehen – der Wert (z.B. "Stoff") steht dann direkt rechts daneben.

Feld-Regeln:
- "kW/(PS): 110/(150)" -> kw=110, ps=150
- "Türen/Sitze: 5/5" -> tueren=5, sitze=5
- "Motor/Antrieb: Hybrid-Plugin Automatik/Frontantrieb" -> kraftstoff="Hybrid-Plugin", getriebe="Automatik", antrieb="Frontantrieb"
- "Motor/Antrieb: Diesel Automatik/Allradantrieb" -> kraftstoff="Diesel", getriebe="Automatik", antrieb="Allradantrieb"
- "km-Stand: 12143" -> km_stand=12143 (nur die Zahl)
- "Barpreis: 38.720 €" -> preis=38720
- "Auftragsnummer: 120204" -> auftragsnummer="120204"
- "TÜV/AU: 06.2028/06.2028" -> tuev_au="06.2028/06.2028"
- fahrzeugname = die große Modell-Überschrift (z.B. "Caddy HYBRID LIFE", "A6 40 TDI Q 2x S LINE") – NICHT "Tiemeyer automobile GmbH" o.ä.

beschreibung:
- WÖRTLICH der gesamte Block unter "Serien- und Sonderausstattung:" inkl. ALLER "***" Trenner.
- Beginnt direkt nach der Überschrift, endet VOR dem Disclaimer "Da wir uns Zwischenverkauf vorbehalten…" bzw. "Barpreis:".
- Nichts kürzen, nichts umformulieren, keine "..." einfügen.

Wenn ein Feld nicht im PDF steht, lass es weg.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { pdf_base64, text, filename } = body ?? {};

    if (!pdf_base64 && !text) {
      return new Response(JSON.stringify({ error: "pdf_base64 or text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContent: unknown = pdf_base64
      ? [
          {
            type: "file",
            file: {
              filename: filename || "expose.pdf",
              file_data: `data:application/pdf;base64,${pdf_base64}`,
            },
          },
          {
            type: "text",
            text: `Extrahiere alle Fahrzeugdaten aus diesem PDF.${filename ? `\nDateiname: ${filename} (Fahrgestellnummer steht oft darin, z.B. WAUZZZ...)` : ""}`,
          },
        ]
      : `${text}${filename ? `\n\nDateiname: ${filename}` : ""}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_fahrzeug",
              description: "Extrahiere die Fahrzeugdaten",
              parameters: SCHEMA,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_fahrzeug" } },
      }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      console.error("AI error", aiRes.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error", status: aiRes.status, detail: errText }), {
        status: aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("no tool call in response", JSON.stringify(aiJson).slice(0, 500));
      return new Response(JSON.stringify({ error: "no tool call" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(toolCall.function.arguments);

    if (!data.fahrgestellnummer && filename) {
      const m = String(filename).match(/(WAU[A-Z0-9]{14}|W[A-Z0-9]{16})/i);
      if (m) data.fahrgestellnummer = m[1].toUpperCase();
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
