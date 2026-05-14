import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

const SCHEMA = {
  type: "object",
  properties: {
    fahrzeugname: { type: "string", description: "Modellbezeichnung wie 'A6 40 TDI Q 2x S LINE'" },
    preis: { type: "number", description: "Barpreis in Euro als reine Zahl" },
    farbe: { type: "string" },
    kw: { type: "number" },
    ps: { type: "number" },
    hubraum: { type: "number" },
    km_stand: { type: "number" },
    kraftstoff: { type: "string", description: "z.B. Benzin, Diesel" },
    getriebe: { type: "string", description: "z.B. Automatik, Schaltgetriebe" },
    antrieb: { type: "string", description: "z.B. Allradantrieb, Frontantrieb" },
    innenausstattung: { type: "string" },
    tueren: { type: "number" },
    sitze: { type: "number" },
    erstzulassung: { type: "string", description: "Format DD.MM.YYYY" },
    tuev_au: { type: "string", description: "Format MM.YYYY/MM.YYYY" },
    auftragsnummer: { type: "string" },
    fahrgestellnummer: { type: "string" },
    beschreibung: { type: "string", description: "Serien- und Sonderausstattung WÖRTLICH aus dem PDF, inkl. *** Trenner, NICHT umformulieren oder kürzen" },
  },
  required: [],
  additionalProperties: false,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { text, filename } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `Du extrahierst Fahrzeugdaten aus deutschen Fahrzeug-Angebots-PDFs (z.B. Tiemeyer/SEG).
Regeln:
- "kW/(PS): 150/(204)" -> kw=150, ps=204
- "Türen/Sitze: 4/5" -> tueren=4, sitze=5
- "Motor/Antrieb: Diesel Automatik/Allradantrieb" -> kraftstoff="Diesel", getriebe="Automatik", antrieb="Allradantrieb"
- "Barpreis: 43.460 €" -> preis=43460 (Tausenderpunkte entfernen)
- Fahrzeugname = die große Modell-Überschrift (nicht der Briefkopf des Händlers)
- beschreibung = WÖRTLICH der gesamte "Serien- und Sonderausstattung"-Block inkl. aller "***" Trenner, ohne Kürzung oder Umformulierung
- Wenn ein Feld nicht im PDF steht, lass es weg
${filename ? `\nDateiname: ${filename} (Fahrgestellnummer steht oft darin, z.B. WAUZZZ...)` : ""}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: text },
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
      return new Response(JSON.stringify({ error: "AI gateway error", status: aiRes.status }), {
        status: aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiRes.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "no tool call" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = JSON.parse(toolCall.function.arguments);

    // Fahrgestellnummer ggf. aus Dateiname
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
