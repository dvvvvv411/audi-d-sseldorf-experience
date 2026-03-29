import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

type Branding = Tables<"brandings">;
type Fahrzeug = Tables<"fahrzeuge">;

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

const AdminEmailTemplates = () => {
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [selectedBranding, setSelectedBranding] = useState<string>("");
  const [selectedFahrzeug, setSelectedFahrzeug] = useState<string>("");
  const [previewHtml, setPreviewHtml] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const [b, f] = await Promise.all([
        supabase.from("brandings").select("*"),
        supabase.from("fahrzeuge").select("*"),
      ]);
      if (b.data) setBrandings(b.data);
      if (f.data) setFahrzeuge(f.data);
    };
    load();
  }, []);

  const handlePreview = () => {
    const branding = brandings.find((b) => b.id === selectedBranding);
    const fahrzeug = fahrzeuge.find((f) => f.id === selectedFahrzeug);
    if (!branding || !fahrzeug) return;
    setPreviewHtml(generateAnfrageEmail(branding, fahrzeug));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5 min-w-[220px]">
          <label className="text-sm font-medium text-gray-700">Branding</label>
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
          <label className="text-sm font-medium text-gray-700">Fahrzeug</label>
          <Select value={selectedFahrzeug} onValueChange={setSelectedFahrzeug}>
            <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
            <SelectContent>
              {fahrzeuge.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handlePreview}
          disabled={!selectedBranding || !selectedFahrzeug}
        >
          Vorschau laden
        </Button>
      </div>

      {previewHtml && (
        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-100">
          <iframe
            srcDoc={previewHtml}
            title="Email Vorschau"
            className="w-full border-0"
            style={{ minHeight: 700 }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminEmailTemplates;
