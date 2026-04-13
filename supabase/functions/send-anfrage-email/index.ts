import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateAnfrageEmail(
  branding: { name: string; strasse: string; plz: string; stadt: string; amtsgericht: string; handelsregister: string; geschaeftsfuehrer: string; ust_id: string },
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
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAADgCAYAAACTptdQAAASZUlEQVR4nO3c22LbuJIFUKb//58zDxmf2LEkgyII1GWt946Bqg10kZJ9HAAAtPJr9wL47vfv379n/nu/fv3S56JkhTPkhVGyUp+GbDD7YF3lYMYlK5whL4ySFRT8ZtEO2SiHcT1Z4Qx5YZSs8IjiTpT1kI1yGOeRFc6QF0bJCqMU8qLqh+0Zh/A8WeEMeWGUrPAOxXtD18P2jEP4nKx8JSuvyctX8vKcrHzTKSvHIS9XdcqLrFzTKStnKcwDDtxclQ+grMxVOSvHIS+zVc6LrMxVOSvvUpD/57CtUeEQysoaFbJyHPKySoW8yMoaFbIyQ/siOHB7ZDyAsrJHxqwch7zskjEvsrJHxqzM1HbzDlwMGQ6grMSQISvHIS9RZMiLrMSQISt3aLdpBy6miAdQVmKKmJXjkJeoIuZFVmKKmJU7tdlspgM3O4Sd9/6OzvXqvPd3da5Z572/o3O9Ou89qvKbjBq6KAFTn7/U4jX1+Uo9XlOfv9TiNfXZo/TmooQqW4g61q3jnmfoWreu+76qY9067nkGdbtfyY3tDk61wFSuZ+W97VC9ntX3t1rlelbe2w7qOV+pDe0MSMVwPFKlxlX2EVmlGlfaS1RValxlH5Gp8RxlNrIjEJWC8I6sNc+67swy1zzz2rPKWvOs685Mzd+XfhOrm1+l8bNl6EOGNXaQpQ9Z1lldhj5kWGMH+nBO6sWvanb2Jq8WsS8R10TcvkRdV3cR+xJxTejLiLQLX9HczI2NIEqPoqyD5yL1KNJaeCxKj6Ksg+f06Ll0i9bMfHb1TFby2dkzecnH3cIoPfsu1WLvbmC25mWzsn+yktvq/slLbu4WRunfX2kWemfTMjWsgrt7KSt1rOilvNThbmGUXiYYADWprp1/y+ksWdkrU1aOQ152y5QXWdmr84wRenF3NSZ6U7qJfFnLSiyRs3Ic8hJN5LzISiwd543/di/gmY7N6CpqT6Kuq7PIPYm8tq6i9iTqujq7qyehH0J2L+CROwrmwOUQ4bDISg4RsnIc8pJFhLzISg5dZpBwC5pd+IhF52c7LmtZyWnX/9jlJSd3C6OqzyOhPgKuXmzGre6drOS1o3fykpe7hVGzexfhLfRnYQZAwx//WtVDWclvZQ/lJT93C6MqD4EhwjmzIA5cTV2+k8F1foGMM9wtjKo2q2x/A1itoNxjdm9lpa47eisvdblbGDWztxHeBG4dAA1/jJp9WCIcPmA/dwtnVBoCtw1NszZu8Kuv819q5zwfATPK3cIV2eeYLW8AsxeNde5+Qtr9BMZcd/ZTVmpxt3DVrBlkV1aWD4CGP0atOhQu6hpW9FFWanC3MEvmIXDpAGj4Y9Tqw+Cizm1l/2QlN3cLs2UdApcNgIY/Ru26MF3UOe3om6zk5G7hLhmHwCUDoOGPUbsvyt0/n3N29ktWctndr90/n/tlGwK3/x3AUYY/ACCyTLPK7QPgjEk2U0F5X5SseFLPIUKfIqyBn7lbWClLVm4dAKMcOuKbmZUsh4/3zcqLrNTnbmGHDFm5bQA0/DHqjqxkOHy8Z3ZeZKUudws7Rc9K2O8AGv4Y9SwrMsQjj3IhKzzibuGqyFm5ZQC8OrFGLhhz3Z2Vq1nypB7LnXmRlVrcLUQRNSvTB0DDH6NWZSXq4eOcFXmRlRrcLUQTMStTB0DDH6NWZyXi4WPcyrzISm7uFqKKlpWw3wEEAOAe0wZAb/8YtSsr0Z6+GLMjL7KSk7uF6CJlZcoAaPhj1O6sRDp8/GxnXmQlF3cLWUTJyvaPgA1/jJqVFZnrYUafZaUHdwurRcjK5QHQUwujqmSlyj6iq1DnCnvIoEqdq+yD+83IytY3gBEmYHKYnRXZq21mf2WlNncLu+zOyqUB8MoEunvjrBUxK1f+XU/q94qWF1mJK1pWrv678tLLzqy8PQBGPHTEFDkrLup4ouZFVuKJmpWr/7689LIrK9t/CQQAgLXeGgAjP3URS4aseFKPI3peZCWO6Fm5+nPkpZcdWfEGEACgmdMDYIanLmLIlBVP6vtlyYus7JclK1d/nrz0sjory94AGv4YtSsrMprTjr7JSk7uFqJbmZVTA6CnEUZ1y0q3/c7WqX6d9nqHbvXrtl/edzYrS94Aevph1O6s7P75nLOzX7KSy+5+7f755LEqK8MDoKcQRnXNStd9X9Wxbh33PEPXunXdN+edycrtbwA99TAqSlairIPXIvQpwhr4WZQ+RVkH8a3IytAA6OmDUd2z0n3/Z3WuV+e9v6N7vbrvn3GjWbn1DaCnHUZFy0q09fBVpP5EWgvfRetPtPUQ191Z8YegAQCa+XEAfPe1s6ecfqpl5d11+ahmTKW8yMq9KmXlOOSFcXdmxRtAAIBmXg6A1Z66uE/VrHhSv0fFvMjKPSpm5TjkhXF3ZcUbQACAZqYPgNGfuogjS1ayrLO6DH3IsMYOsvQhyzrZ746sPB0AvWZmlKw8pi6Pqct3avKYujymLox6lRUfAQMANDN1APQ6m1HZspJtvdVkqn+mtVaUrf7Z1ss+s7PycAD0eplRsvKa+nylHs+pzVfq8Zr6MOpZVnwEDADQzLQB0GtsRmXNStZ1Z5ex7hnXXEHWumddN+vNzMq3AdBrZUbJyhh1+kMdfqZGf6jDGHVi1KOs+AgYAKCZKQOg19eMyp6V7OvPJnO9M689o+z1zr5+1pmVlS8DoNfJjJKVc7rXq/v+z+heq+77P0u9GPVvVnwEDADQzOUB0GtrRlXJSpV9RFehzhX2kEGVOlfZB/ebkRVvAAEAmjEAAgA0878B0BdJGSUr7+lat677vqJrzbru+yp1Y9TnrFx6A+j7CoyqlpVq+4mmUn0r7SWiavWtth/uczUrPgIGAGjGAAgA0IwBEACgmf+OwxdIGScr13SrX7f9ztStdt32O5v6MeojK2+/AfRFVUZVzUrVfe1Wsa4V9xRB1bpW3RfzXcmKj4ABAJoxAAIANGMABABoxgAIANCMARAAoBkDIABAM7/e+dtBfkW9J1l5TF0eU5fv1OQxdXlMXRj1Tla8AQQAaMYACADQjAEQAKAZAyAAQDMGQACAZgyAAADNGAABAJoxAAIANGMABABoxgAIANCMARAAoBkDIABAMwZAAIBmDIAAAM0YAAEAmjEAAgA0YwAEAGjGAAgA0IwBEACgmf9+/fr16+x/9Pv37993LIbYZOW7d/b3Th0zkpevZOU5WflOXhj1bla8AQQAaMYACADQjAEQAKAZAyAAQDMGQACAZgyAAADNvD0AVv8VfOapmpWq+9qtYl0r7imCqnWtui/mu5KV/47D3w5inKxc061+3fY7U7faddvvbOrHqI+s+AgYAKAZAyAAQDMGQACAZi4NgL6oyqhqWam2n2gq1bfSXiKqVt9q++E+V7PyvwHQF0gZJSvv6Vq3rvu+omvNuu77KnVj1Oes+AgYAKAZAyAAQDOXB0DfV2BUlaxU2Ud0FepcYQ8ZVKlzlX1wvxlZ8QYQAKCZLwOgL5IySlbO6V6v7vs/o3utuu//LPVi1L9ZmfIG0GtrRmXPSvb1Z5O53pnXnlH2emdfP+vMyoqPgAEAmvk2AHqdzChZGaNOf6jDz9ToD3UYo06MepSVaW8Avb5mVNasZF13dhnrnnHNFWSte9Z1s97MrPgIGACgmYcDoNfKjJKV19TnK/V4Tm2+Uo/X1IdRz7Iy9Q2g19iMypaVbOutJlP9M621omz1z7Ze9pmdFR8BAwA083QA9HqZUbLymLo8pi7fqclj6vKYujDqVVamvwH0OptRWbKSZZ3VZehDhjV2kKUPWdbJfndkxUfAAADNvBwA333N7Kmmn6pZeXd9PqJ5rWJeZOUeFbNyHPLCuLuy4g0gAEAzPw6AVZ++mK9aVjyh36tSXmTlXpWychzywrg7s+INIABAM7cOgFGfvognWlairYevIvUn0lr4Llp/oq2HuO7OytAA6LUzo7pnpfv+z+pcr857f0f3enXfP+NGs3L7R8CedhgVJStR1sFrEfoUYQ38LEqfoqyD+FZkZXgA9PTBqK5Z6brvqzrWreOeZ+hat6775rwzWVnySyCeehi1Oyu7fz7n7OyXrOSyu1+7fz55rMrKqQHQUwijumWl235n61S/Tnu9Q7f6ddsv7zublWV/BsbTD6N2ZUVGc9rRN1nJyd1CdCuzcnoAvPI04hD0kikrV36eJ/Q5suRFVvbLkpWrP09eelmdFX8IGgCgmbcGwExPX+yVISue0OOInhdZiSN6Vq7+HHnpZUdWvAEEAGjm7QEww9MXMUTOiif0eKLmRVbiiZqVq/++vPSyKyuX3gBGPnzEEjErLui4ouVFVuKKlpWr/6689LIzK1s/AjYEMmp2VmSvtpn9lZXa3C3ssjsrlwdATyuMqpKVKvuIrkKdK+whgyp1rrIP7jcjK9t/CWT3BEwes7Iicz3M6LOs9OBuYbUIWZkyAF6dRCMUgjV2Z+Xqf+8Jfa2deZGVXNwtZBElK9PeAO4+fOSxKytRDh3n7MiLrOTkbiG6SFnZ/hEwAABrTR0AvQVk1OqsRHrq4ryVeZGV3NwtRBUtK9PfABoCGbUqK9EOHe9ZkRdZqcHdQjQRs3LLR8CGQEbdnZWIh4733ZkXWanF3UIUUbMS9juAhkBGPcuKDPHIo1zICo+4W7gqclZuGwBnTKyRC8c8d2RlRnY8occ0Oy+yUpe7hZ2iZ+X2EEYvAHHMyorM9RDlAVFW4nO3sFqGrCwJYoZCEEOE/6nLWh678yIreezOynHISxdZZp6w3wH8V4TDCwDwTKZZZckAOGuSzVRY3rP7CXn3z+ecnf2SlVx292v3z+d+s2aUVVlZ9gbQEMioXRelCzqnHX2TlZzcLdwl2/B3HIs/AjYEMmr1hemCzm1l/2QlN3cLs2Uc/o5jw3cADYGMWnUYXNA1rOijrNTgbmGWrMPfcWz6JRBDIKNu/zV4F3Qpt/7NLFkpxd3CVZmHv+NY9Gdgnpk5wDlstd0x7MtMXbPzIit1uVs4q8rssvXPwMzcuLeBtc0+JC5o4DjcLZxTZfg7jgB/B9AQyIjZvZWVuu7orbzU5W5hVKXh7zg2fwT8mY9seGTFZSorNaz6H6+81OBuYVTV+WT7G8APswviKSy/VT2UlfxW9lBe8nO3MKrq8HccgQbA4zAE8tfq3slKXjt6Jy95uVsYVXn4O45AHwF/5rey+opwWcpKDhGychzykkWEvMhKDl1mkHAL+nDXYY3YBGJczv+SlZgiZuU45CWqiHmRlZi6zR2hPgL+7K6CRbwMuovak6jr6ixyTyKvrauoPYm6rs66DX/HEfgN4Ic7D0rkxnSQ6RKUlb0yZeU45GW3THmRlb06zxihF/dZ5yZVc3cvZaWOFb2UlzrcLYzSy0QD4HHc/1SXpWlZreyfrOS2un/ykpu7hVH691eahX7wxzvz2dUzWclnZ8/kJR93C6P07LtUi/1MM+OL0qMo6+C5SD2KtBYei9KjKOvgOT16LuWiP6z6om/W5u4SsS8R10TcvkRdV3cR+xJxTejLiLQL/7D6t70yN/tOGfqQYY0dZOlDlnVWl6EPGdbYgT6ck3rxn+34tf/szb8qa82zrjuzzDXPvPasstY867ozU/P3ldjEh51/+6lKIH5SpcZV9hFZpRpX2ktUVWpcZR+RqfEcZTby2c5wHEetgBxH7XpW3tsO1etZfX+rVa5n5b3toJ7zldvQZ7sD8yFbcDrWreOeZ+hat677vqpj3TrueQZ1u1/ZjX2IEqJ/RQmV+vylFq+pz1fq8Zr6/KUWr6nPHqU391nUgD1S6ftLZ0U4cJ3r1Xnv7+pcs857f0fnenXee1QtNvlZphB2EvHAyUpMEbNyHPISVcS8yEpMEbNyp1ab/cwBjCHDgZOVGDJk5TjkJYoMeZGVGDJk5Q4tN/2ZA7hHxgMnK3tkzMpxyMsuGfMiK3tkzMpMrTf/mQO4RoUDJytrVMjKccjLKhXyIitrVMjKDIrwgEM4V+XDJitzVc7KccjLbJXzIitzVc7KuxTkBQfwmk4HTlau6ZSV45CXqzrlRVau6ZSVsxRmkEM4xmGTlVGy8oe8jJEXWRklK2MU6Q0O4VcO23Oy8pWsvCYvX8nLc7Lylaycp2AXdT2EDtt5ssIZ8sIoWeEdijdR9UPosM0jK5whL4ySFUYp5M2yHkaHbD1Z4Qx5YZSs8IjibhDtMDpkcckKZ8gLo2QFBQ9o9sF0sOqSFc6QF0bJCgAAFPN/l4m+LAzWb1kAAAAASUVORK5CYII=" width="160" alt="Audi" style="display:block;margin:0 auto;"/>
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
          <p style="font-size:12px;color:#999;margin:0;letter-spacing:0.5px;">Audi Vertriebssystem — Ein Service der AUDI AG</p>
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
    const { branding_id, fahrzeug_id, kunde_email } = await req.json();

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
