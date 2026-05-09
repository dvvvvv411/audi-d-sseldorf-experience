const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName } = await req.json();
    if (!firstName || typeof firstName !== "string") {
      return new Response(JSON.stringify({ error: "firstName required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ gender: "unknown" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You determine the gender associated with a German given name. Reply with exactly one word: 'male', 'female', or 'unknown'. No punctuation, no explanation.",
          },
          { role: "user", content: `Name: ${firstName}` },
        ],
      }),
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ gender: "unknown" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const raw = (data?.choices?.[0]?.message?.content ?? "").toString().toLowerCase().trim();
    let gender: "male" | "female" | "unknown" = "unknown";
    if (raw.includes("female") || raw.includes("weiblich")) gender = "female";
    else if (raw.includes("male") || raw.includes("männlich")) gender = "male";

    return new Response(JSON.stringify({ gender }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ gender: "unknown", error: String(e) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
