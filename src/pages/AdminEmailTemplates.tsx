import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Branding = Tables<"brandings">;
type Fahrzeug = Tables<"fahrzeuge">;
type Verkaeufer = Tables<"verkaeufer">;

const generateAnfrageEmail = (branding: Branding, fahrzeug: Fahrzeug) => {
  const preis = Number(fahrzeug.preis).toLocaleString("de-DE", { minimumFractionDigits: 0 });
  const km = fahrzeug.km_stand ? Number(fahrzeug.km_stand).toLocaleString("de-DE") : "–";

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;">
    <tr><td align="center" style="padding:30px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e0e0e0;">

        <!-- Header -->
        <tr><td style="background:#000000;padding:30px 40px;text-align:center;">
          <svg viewBox="0 0 200 50" width="160" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="25" r="20" stroke="#ffffff" stroke-width="3"/>
            <circle cx="73" cy="25" r="20" stroke="#ffffff" stroke-width="3"/>
            <circle cx="106" cy="25" r="20" stroke="#ffffff" stroke-width="3"/>
            <circle cx="139" cy="25" r="20" stroke="#ffffff" stroke-width="3"/>
          </svg>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <h1 style="font-size:22px;font-weight:bold;color:#000;margin:0 0 20px;">Vielen Dank für Ihre Anfrage</h1>
          <p style="font-size:14px;line-height:1.6;margin:0 0 15px;">
            Sehr geehrte Kundin, sehr geehrter Kunde,
          </p>
          <p style="font-size:14px;line-height:1.6;margin:0 0 25px;">
            wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.
          </p>

          <!-- Fahrzeug-Block -->
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;margin-bottom:25px;">
            <tr><td style="background:#f8f8f8;padding:15px 20px;border-bottom:1px solid #e0e0e0;">
              <strong style="font-size:14px;color:#000;">Ihr ausgewähltes Fahrzeug</strong>
            </td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-size:16px;font-weight:bold;color:#000;padding-bottom:12px;">${fahrzeug.fahrzeugname}</td></tr>
                <tr><td style="padding-bottom:8px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#666;width:100px;">Preis:</td>
                      <td style="font-size:13px;font-weight:bold;color:#000;">${preis} €</td>
                    </tr>
                  </table>
                </td></tr>
                ${fahrzeug.erstzulassung ? `<tr><td style="padding-bottom:8px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#666;width:100px;">EZ:</td>
                      <td style="font-size:13px;color:#000;">${fahrzeug.erstzulassung}</td>
                    </tr>
                  </table>
                </td></tr>` : ""}
                <tr><td style="padding-bottom:8px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#666;width:100px;">Kilometerstand:</td>
                      <td style="font-size:13px;color:#000;">${km} km</td>
                    </tr>
                  </table>
                </td></tr>
                ${fahrzeug.kraftstoff ? `<tr><td style="padding-bottom:8px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#666;width:100px;">Kraftstoff:</td>
                      <td style="font-size:13px;color:#000;">${fahrzeug.kraftstoff}</td>
                    </tr>
                  </table>
                </td></tr>` : ""}
                ${fahrzeug.ps ? `<tr><td>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="font-size:13px;color:#666;width:100px;">Leistung:</td>
                      <td style="font-size:13px;color:#000;">${fahrzeug.ps} PS (${fahrzeug.kw} kW)</td>
                    </tr>
                  </table>
                </td></tr>` : ""}
              </table>
            </td></tr>
          </table>

          <p style="font-size:14px;line-height:1.6;margin:0 0 10px;">
            Bei Fragen stehen wir Ihnen gerne zur Verfügung.
          </p>
          <p style="font-size:14px;line-height:1.6;margin:0;">
            Mit freundlichen Grüßen<br/>
            <strong>${branding.name}</strong>
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e0e0e0;margin:0;"/></td></tr>

        <!-- Audi Vertriebssystem Hinweis -->
        <tr><td style="padding:20px 40px 10px;text-align:left;">
          <p style="font-size:12px;color:#999;margin:0;letter-spacing:0.5px;">
            Audi Vertriebssystem — Ein Service der AUDI AG
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:10px 40px 30px;">
          <p style="font-size:11px;color:#999;line-height:1.5;margin:0;text-align:left;">
            AUDI AG<br/>
            Auto-Union-Straße 1, 85057 Ingolstadt<br/>
            www.audi.de<br/><br/>
            AG Ingolstadt · HRB 1<br/>
            Vorstand: Gernot Döllner (Vorsitzender)<br/>
            USt-IdNr.: DE 811 115 368
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const generateMarketingEmail = (branding: Branding, verkaeufer: Verkaeufer) => {
  const avatarUrl = verkaeufer.avatar_url || "";
  const fullName = `${verkaeufer.vorname} ${verkaeufer.nachname}`;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td style="padding:30px 20px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">

        <!-- Persönlicher Text -->
        <tr><td style="padding:0 0 20px;font-size:14px;line-height:1.7;color:#333;">
          Sehr geehrte Damen und Herren,<br/><br/>
          mein Name ist ${fullName} und ich betreue Sie als persönlicher Ansprechpartner bei ${branding.name}.<br/><br/>
          Gerne möchte ich Sie darauf aufmerksam machen, dass wir derzeit ausgewählte Fahrzeuge im Kundenauftrag zu attraktiven Sonderkonditionen anbieten. Sämtliche Fahrzeuge werden selbstverständlich mit Garantie übergeben.<br/><br/>
          Eine Übersicht unserer aktuellen Fahrzeuge finden Sie hier:<br/>
          <a href="%link%" style="color:#333;text-decoration:underline;">%link%</a><br/><br/>
          Sollte ein Fahrzeug Ihr Interesse wecken, können Sie direkt über unsere Plattform eine unverbindliche Anfrage stellen. Ich werde mich anschließend zeitnah persönlich bei Ihnen melden.<br/><br/>
          Für Rückfragen stehe ich Ihnen jederzeit gerne per E-Mail oder telefonisch unter %telefon% zur Verfügung.<br/><br/>
          Mit freundlichen Grüßen
        </td></tr>

        <!-- Signatur -->
        <tr><td style="padding:20px 0 0;border-top:1px solid #e0e0e0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              ${avatarUrl ? `<td style="vertical-align:top;padding-right:15px;">
                <img src="${avatarUrl}" alt="${fullName}" width="60" height="60" style="border-radius:50%;object-fit:cover;display:block;" />
              </td>` : ""}
              <td style="vertical-align:top;">
                <p style="margin:0;font-size:14px;font-weight:bold;color:#000;">${fullName}</p>
                <p style="margin:2px 0 0;font-size:12px;color:#666;">Verkaufsberater | ${branding.name}</p>
                <p style="margin:4px 0 0;font-size:12px;color:#666;">${verkaeufer.telefon} · ${verkaeufer.email}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Audi Ringe + Branding -->
        <tr><td style="padding:20px 0 0;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-right:12px;vertical-align:middle;">
                <svg viewBox="0 0 200 50" width="80" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="40" cy="25" r="20" stroke="#000000" stroke-width="3"/>
                  <circle cx="73" cy="25" r="20" stroke="#000000" stroke-width="3"/>
                  <circle cx="106" cy="25" r="20" stroke="#000000" stroke-width="3"/>
                  <circle cx="139" cy="25" r="20" stroke="#000000" stroke-width="3"/>
                </svg>
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;font-size:12px;color:#666;">${branding.name}</p>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:15px 0 0;">
          <p style="font-size:10px;color:#999;line-height:1.5;margin:0;">
            ${branding.name} · ${branding.strasse}, ${branding.plz} ${branding.stadt}<br/>
            ${branding.amtsgericht} · ${branding.handelsregister} · Geschäftsführer: ${branding.geschaeftsfuehrer}<br/>
            USt-IdNr.: ${branding.ust_id}
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const AdminEmailTemplates = () => {
  const { toast } = useToast();
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [selectedBranding, setSelectedBranding] = useState<string>("");
  const [selectedFahrzeug, setSelectedFahrzeug] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");

  // Marketing state
  const [marketingBranding, setMarketingBranding] = useState<string>("");
  const [marketingVerkaeufer, setMarketingVerkaeufer] = useState<string>("");
  const [marketingPreviewHtml, setMarketingPreviewHtml] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const [b, f, v] = await Promise.all([
        supabase.from("brandings").select("*"),
        supabase.from("fahrzeuge").select("*"),
        supabase.from("verkaeufer").select("*"),
      ]);
      if (b.data) setBrandings(b.data);
      if (f.data) setFahrzeuge(f.data);
      if (v.data) setVerkaeufer(v.data);
    };
    load();
  }, []);

  const handlePreview = () => {
    const branding = brandings.find((b) => b.id === selectedBranding);
    const fahrzeug = fahrzeuge.find((f) => f.id === selectedFahrzeug);
    if (!branding || !fahrzeug) return;
    setPreviewHtml(generateAnfrageEmail(branding, fahrzeug));
  };

  const handleMarketingPreview = () => {
    const branding = brandings.find((b) => b.id === marketingBranding);
    const vk = verkaeufer.find((v) => v.id === marketingVerkaeufer);
    if (!branding || !vk) return;
    setMarketingPreviewHtml(generateMarketingEmail(branding, vk));
  };

  const handleCopyHtml = async () => {
    if (!marketingPreviewHtml) return;
    try {
      await navigator.clipboard.writeText(marketingPreviewHtml);
      toast({ title: "HTML kopiert", description: "Das Email-Template wurde in die Zwischenablage kopiert." });
    } catch {
      toast({ title: "Fehler", description: "HTML konnte nicht kopiert werden.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-10">
      {/* Anfrage-Email Sektion */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Anfrage-Bestätigung</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Branding</label>
            <Select value={selectedBranding} onValueChange={setSelectedBranding}>
              <SelectTrigger><SelectValue placeholder="Branding wählen" /></SelectTrigger>
              <SelectContent>
                {brandings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-[280px]">
            <label className="text-sm font-medium text-muted-foreground">Fahrzeug</label>
            <Select value={selectedFahrzeug} onValueChange={setSelectedFahrzeug}>
              <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
              <SelectContent>
                {fahrzeuge.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePreview} disabled={!selectedBranding || !selectedFahrzeug}>
            Vorschau laden
          </Button>
        </div>

        {previewHtml && (
          <div className="border border-border rounded-md overflow-hidden bg-muted">
            <iframe srcDoc={previewHtml} title="Email Vorschau" className="w-full border-0" style={{ minHeight: 700 }} />
          </div>
        )}
      </div>

      {/* Marketing-Email Sektion */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Marketing-Email</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Verkäufer</label>
            <Select value={marketingVerkaeufer} onValueChange={setMarketingVerkaeufer}>
              <SelectTrigger><SelectValue placeholder="Verkäufer wählen" /></SelectTrigger>
              <SelectContent>
                {verkaeufer.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Branding</label>
            <Select value={marketingBranding} onValueChange={setMarketingBranding}>
              <SelectTrigger><SelectValue placeholder="Branding wählen" /></SelectTrigger>
              <SelectContent>
                {brandings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleMarketingPreview} disabled={!marketingBranding || !marketingVerkaeufer}>
            Vorschau laden
          </Button>

          {marketingPreviewHtml && (
            <Button variant="outline" onClick={handleCopyHtml}>
              <Copy className="mr-1.5 h-4 w-4" />
              HTML kopieren
            </Button>
          )}
        </div>

        {marketingPreviewHtml && (
          <div className="border border-border rounded-md overflow-hidden bg-muted">
            <iframe srcDoc={marketingPreviewHtml} title="Marketing Email Vorschau" className="w-full border-0" style={{ minHeight: 500 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
