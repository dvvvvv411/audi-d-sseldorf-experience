import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Branding = Tables<"brandings">;
type Fahrzeug = Tables<"fahrzeuge">;
type Verkaeufer = Tables<"verkaeufer">;
type Anfrage = Tables<"anfragen">;

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
        <tr><td style="background:#000000;padding:30px 40px;text-align:center;">
          ${branding.email_logo_url ? `<img src="${branding.email_logo_url}" alt="" width="160" style="display:block;margin:0 auto;filter:brightness(0) invert(1);" />` : `<span style="color:#fff;font-size:18px;font-weight:bold;letter-spacing:2px;">${branding.name}</span>`}
        </td></tr>
        <tr><td style="padding:40px;">
          <h1 style="font-size:22px;font-weight:bold;color:#000;margin:0 0 20px;">Vielen Dank für Ihre Anfrage</h1>
          <p style="font-size:14px;line-height:1.6;margin:0 0 15px;">Sehr geehrte Kundin, sehr geehrter Kunde,</p>
          <p style="font-size:14px;line-height:1.6;margin:0 0 25px;">wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich bei Ihnen melden.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0e0e0;margin-bottom:25px;">
            <tr><td style="background:#f8f8f8;padding:15px 20px;border-bottom:1px solid #e0e0e0;"><strong style="font-size:14px;color:#000;">Ihr ausgewähltes Fahrzeug</strong></td></tr>
            <tr><td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="font-size:16px;font-weight:bold;color:#000;padding-bottom:12px;">${fahrzeug.fahrzeugname}</td></tr>
                <tr><td style="padding-bottom:8px;"><table cellpadding="0" cellspacing="0"><tr><td style="font-size:13px;color:#666;width:100px;">Preis:</td><td style="font-size:13px;font-weight:bold;color:#000;">${preis} €</td></tr></table></td></tr>
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
        <tr><td style="padding:20px 40px 10px;text-align:left;"><p style="font-size:12px;color:#999;margin:0;letter-spacing:0.5px;">Vertriebssystem — Ein Service der ${(branding as any).footer_unternehmensname || branding.name}</p></td></tr>
        <tr><td style="padding:10px 40px 30px;"><p style="font-size:11px;color:#999;line-height:1.5;margin:0;text-align:left;">${(branding as any).footer_unternehmensname || branding.name}<br/>${branding.strasse}, ${branding.plz} ${branding.stadt}<br/><br/>${branding.amtsgericht} · ${branding.handelsregister}<br/>Vorstand: ${branding.geschaeftsfuehrer}<br/>USt-IdNr.: ${branding.ust_id}</p></td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

const generateMarketingEmail = (branding: Branding, verkaeufer: Verkaeufer) => {
  const fullName = `${verkaeufer.vorname} ${verkaeufer.nachname}`;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td style="padding:30px 20px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
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
        <tr><td style="padding:20px 0 0;border-top:1px solid #e0e0e0;">
          <p style="margin:0;font-size:14px;font-weight:bold;color:#000;">${fullName}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#666;">Verkaufsberater | ${branding.name}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#666;">${verkaeufer.telefon} · ${verkaeufer.email}</p>
        </td></tr>
        <tr><td style="padding:20px 0 0;">
          ${branding.email_logo_url ? `<img src="${branding.email_logo_url}" alt="" width="80" style="display:block;" />` : ""}
        </td></tr>
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

const generateServiceberichtEmail = (
  branding: Branding,
  verkaeufer: Verkaeufer,
  fahrzeug: Fahrzeug,
  anrede: string,
) => {
  const fullName = `${verkaeufer.vorname} ${verkaeufer.nachname}`;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td style="padding:30px 20px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr><td style="padding:0 0 20px;font-size:14px;line-height:1.7;color:#333;">
          ${anrede}<br/><br/>
          vielen Dank für das freundliche Telefonat sowie für Ihr Interesse an unserem Fahrzeug.<br/><br/>
          Wie besprochen sende ich Ihnen anbei den vollständigen Servicebericht sowie das ausführliche Exposé zum <strong>${fahrzeug.fahrzeugname}</strong>. Im Servicebericht finden Sie sämtliche dokumentierten Wartungs- und Servicearbeiten, die das Fahrzeug während seiner bisherigen Laufzeit erhalten hat. Das Exposé bietet Ihnen darüber hinaus einen detaillierten Überblick über die technischen Daten, die Ausstattungsmerkmale sowie die Historie des Fahrzeugs.<br/><br/>
          Bitte nehmen Sie sich in Ruhe die Zeit, beide Dokumente zu prüfen. Sollten im Anschluss noch Fragen offenbleiben oder Sie weitere Informationen wünschen, stehe ich Ihnen jederzeit gerne per E-Mail oder telefonisch unter <strong>${verkaeufer.telefon}</strong> zur Verfügung.<br/><br/>
          Falls Sie Interesse an einer Probefahrt haben, lässt sich diese kurzfristig und unverbindlich vereinbaren – gerne stimme ich mit Ihnen einen passenden Termin ab, sodass Sie sich persönlich von der Qualität, der Verarbeitung und dem Fahrgefühl des Fahrzeugs überzeugen können. Eine Probefahrt ist aus meiner Sicht der beste Weg, um ein authentisches Gefühl für das Fahrzeug zu bekommen und alle offenen Fragen direkt vor Ort zu klären.<br/><br/>
          Ich freue mich darauf, von Ihnen zu hören, und stehe Ihnen für die nächsten Schritte sehr gerne zur Seite.<br/><br/>
          Mit freundlichen Grüßen
        </td></tr>
        <tr><td style="padding:20px 0 0;border-top:1px solid #e0e0e0;">
          <p style="margin:0;font-size:14px;font-weight:bold;color:#000;">${fullName}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#666;">Verkaufsberater | ${branding.name}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#666;">${verkaeufer.telefon} · ${verkaeufer.email}</p>
        </td></tr>
        <tr><td style="padding:20px 0 0;">
          ${branding.email_logo_url ? `<img src="${branding.email_logo_url}" alt="" width="80" style="display:block;" />` : ""}
        </td></tr>
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

const generatePersoenlichesAngebotEmail = (
  branding: Branding,
  verkaeufer: Verkaeufer,
  fahrzeug: Fahrzeug,
  anrede: string,
) => {
  const fullName = `${verkaeufer.vorname} ${verkaeufer.nachname}`;

  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td style="padding:30px 20px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr><td style="padding:0 0 20px;font-size:14px;line-height:1.7;color:#333;">
          ${anrede}<br/><br/>
          vielen Dank für Ihr Interesse an unserem Fahrzeug sowie für das angenehme Telefonat.<br/><br/>
          Wie bereits telefonisch besprochen, sende ich Ihnen hiermit Ihr persönliches Angebot zum <strong>${fahrzeug.fahrzeugname}</strong>. Alle relevanten Eckdaten, Konditionen und Ausstattungsmerkmale haben wir in dem beigefügten Dokument für Sie übersichtlich zusammengestellt.<br/><br/>
          Wichtig ist uns: Sämtliche Fahrzeuge aus unserem Bestand werden grundsätzlich mit einer umfassenden Gebrauchtwagengarantie übergeben. Diese deckt zentrale Bauteile des Fahrzeugs ab – darunter Motor, Getriebe, Antrieb, Elektronik sowie zahlreiche weitere sicherheits- und komfortrelevante Komponenten. So können Sie Ihr neues Fahrzeug von Anfang an mit einem sicheren Gefühl genießen, ohne sich Sorgen um unerwartete Reparaturkosten machen zu müssen.<br/><br/>
          Sollten Sie Fragen zum Angebot oder zur Garantie haben oder weitere Informationen wünschen, stehe ich Ihnen jederzeit gerne per E-Mail oder telefonisch unter <strong>${verkaeufer.telefon}</strong> zur Verfügung. Selbstverständlich können wir auch jederzeit einen Termin für eine Probefahrt vereinbaren.<br/><br/>
          Ich freue mich auf Ihre Rückmeldung.<br/><br/>
          Mit freundlichen Grüßen
        </td></tr>
        <tr><td style="padding:20px 0 0;border-top:1px solid #e0e0e0;">
          <p style="margin:0;font-size:14px;font-weight:bold;color:#000;">${fullName}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#666;">Verkaufsberater | ${branding.name}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#666;">${verkaeufer.telefon} · ${verkaeufer.email}</p>
        </td></tr>
        <tr><td style="padding:20px 0 0;">
          ${branding.email_logo_url ? `<img src="${branding.email_logo_url}" alt="" width="80" style="display:block;" />` : ""}
        </td></tr>
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

const buildAnrede = (gender: "male" | "female" | "unknown", nachname: string) => {
  if (gender === "male") return `Sehr geehrter Herr ${nachname},`;
  if (gender === "female") return `Sehr geehrte Frau ${nachname},`;
  return `Sehr geehrte/r Herr/Frau ${nachname},`;
};

const AdminEmailTemplates = () => {
  const { toast } = useToast();
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [anfragen, setAnfragen] = useState<Anfrage[]>([]);

  // Anfrage email
  const [selectedBranding, setSelectedBranding] = useState<string>("");
  const [selectedFahrzeug, setSelectedFahrzeug] = useState<string>("");

  // Marketing
  const [marketingBranding, setMarketingBranding] = useState<string>("");
  const [marketingVerkaeufer, setMarketingVerkaeufer] = useState<string>("");
  const [marketingBetreff, setMarketingBetreff] = useState<string>("");

  // Servicebericht
  const [svcKunde, setSvcKunde] = useState<string>("");
  const [svcVerkaeufer, setSvcVerkaeufer] = useState<string>("");
  const [svcBranding, setSvcBranding] = useState<string>("");
  const [svcFahrzeug, setSvcFahrzeug] = useState<string>("");
  const [genderCache, setGenderCache] = useState<Record<string, "male" | "female" | "unknown">>({});

  // Persönliches Angebot
  const [paKunde, setPaKunde] = useState<string>("");
  const [paVerkaeufer, setPaVerkaeufer] = useState<string>("");
  const [paBranding, setPaBranding] = useState<string>("");
  const [paFahrzeug, setPaFahrzeug] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      const [b, f, v, a] = await Promise.all([
        supabase.from("brandings").select("*"),
        supabase.from("fahrzeuge").select("*"),
        supabase.from("verkaeufer").select("*"),
        supabase.from("anfragen").select("*").order("created_at", { ascending: false }),
      ]);
      if (b.data) {
        setBrandings(b.data);
        if (b.data[0]) {
          setSelectedBranding(b.data[0].id);
          setMarketingBranding(b.data[0].id);
          setSvcBranding(b.data[0].id);
          setPaBranding(b.data[0].id);
        }
      }
      if (f.data) {
        setFahrzeuge(f.data);
        if (f.data[0]) {
          setSelectedFahrzeug(f.data[0].id);
          setSvcFahrzeug(f.data[0].id);
          setPaFahrzeug(f.data[0].id);
        }
      }
      if (v.data) {
        setVerkaeufer(v.data);
        if (v.data[0]) {
          setMarketingVerkaeufer(v.data[0].id);
          setSvcVerkaeufer(v.data[0].id);
          setPaVerkaeufer(v.data[0].id);
        }
      }
      if (a.data) {
        setAnfragen(a.data);
        if (a.data[0]) {
          setSvcKunde(a.data[0].id);
          setPaKunde(a.data[0].id);
        }
      }
    };
    load();
  }, []);

  // Detect gender for selected customer
  const kunde = anfragen.find((x) => x.id === svcKunde);
  useEffect(() => {
    if (!kunde) return;
    if (genderCache[kunde.vorname] !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("detect-gender", {
          body: { firstName: kunde.vorname },
        });
        const g = (data?.gender as "male" | "female" | "unknown") || "unknown";
        if (!cancelled) setGenderCache((prev) => ({ ...prev, [kunde.vorname]: g }));
      } catch {
        if (!cancelled) setGenderCache((prev) => ({ ...prev, [kunde.vorname]: "unknown" }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kunde?.vorname]);

  // Auto-set fahrzeug when customer changes
  useEffect(() => {
    if (kunde?.fahrzeug_id && fahrzeuge.find((f) => f.id === kunde.fahrzeug_id)) {
      setSvcFahrzeug(kunde.fahrzeug_id);
    }
  }, [kunde?.fahrzeug_id, fahrzeuge]);

  const anfrageBranding = brandings.find((b) => b.id === selectedBranding);
  const anfrageFahrzeug = fahrzeuge.find((f) => f.id === selectedFahrzeug);
  const anfrageHtml =
    anfrageBranding && anfrageFahrzeug ? generateAnfrageEmail(anfrageBranding, anfrageFahrzeug) : "";
  const anfrageBetreff = anfrageFahrzeug ? `Ihre Anfrage – ${anfrageFahrzeug.fahrzeugname}` : "";

  const mBranding = brandings.find((b) => b.id === marketingBranding);
  const mVerkaeufer = verkaeufer.find((v) => v.id === marketingVerkaeufer);
  const marketingHtml = mBranding && mVerkaeufer ? generateMarketingEmail(mBranding, mVerkaeufer) : "";
  useEffect(() => {
    if (mBranding && !marketingBetreff) {
      setMarketingBetreff(`Ausgewählte Fahrzeugangebote – ${mBranding.name}`);
    }
  }, [mBranding?.id]);

  const sBranding = brandings.find((b) => b.id === svcBranding);
  const sVerkaeufer = verkaeufer.find((v) => v.id === svcVerkaeufer);
  const sFahrzeug = fahrzeuge.find((f) => f.id === svcFahrzeug);
  const svcGender = kunde ? genderCache[kunde.vorname] || "unknown" : "unknown";
  const svcAnrede = kunde ? buildAnrede(svcGender, kunde.nachname) : "";
  const svcHtml =
    sBranding && sVerkaeufer && sFahrzeug && kunde
      ? generateServiceberichtEmail(sBranding, sVerkaeufer, sFahrzeug, svcAnrede)
      : "";
  const svcBetreff = sFahrzeug ? `Servicebericht & Exposé – ${sFahrzeug.fahrzeugname}` : "";

  // Persönliches Angebot
  const paKundeObj = anfragen.find((x) => x.id === paKunde);
  useEffect(() => {
    if (!paKundeObj) return;
    if (genderCache[paKundeObj.vorname] !== undefined) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase.functions.invoke("detect-gender", {
          body: { firstName: paKundeObj.vorname },
        });
        const g = (data?.gender as "male" | "female" | "unknown") || "unknown";
        if (!cancelled) setGenderCache((prev) => ({ ...prev, [paKundeObj.vorname]: g }));
      } catch {
        if (!cancelled) setGenderCache((prev) => ({ ...prev, [paKundeObj.vorname]: "unknown" }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paKundeObj?.vorname]);

  useEffect(() => {
    if (paKundeObj?.fahrzeug_id && fahrzeuge.find((f) => f.id === paKundeObj.fahrzeug_id)) {
      setPaFahrzeug(paKundeObj.fahrzeug_id);
    }
  }, [paKundeObj?.fahrzeug_id, fahrzeuge]);

  const paBrandingObj = brandings.find((b) => b.id === paBranding);
  const paVerkaeuferObj = verkaeufer.find((v) => v.id === paVerkaeufer);
  const paFahrzeugObj = fahrzeuge.find((f) => f.id === paFahrzeug);
  const paGender = paKundeObj ? genderCache[paKundeObj.vorname] || "unknown" : "unknown";
  const paAnrede = paKundeObj ? buildAnrede(paGender, paKundeObj.nachname) : "";
  const paHtml =
    paBrandingObj && paVerkaeuferObj && paFahrzeugObj && paKundeObj
      ? generatePersoenlichesAngebotEmail(paBrandingObj, paVerkaeuferObj, paFahrzeugObj, paAnrede)
      : "";
  const paBetreff = paFahrzeugObj ? `Ihr persönliches Angebot – ${paFahrzeugObj.fahrzeugname}` : "";

  const handleCopy = async (text: string, label = "Inhalt") => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} kopiert`, description: "In die Zwischenablage kopiert." });
    } catch {
      toast({ title: "Fehler", description: "Konnte nicht kopiert werden.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-10">
      {/* Anfrage-Email */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Anfrage-Bestätigung</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Branding</label>
            <Select value={selectedBranding} onValueChange={setSelectedBranding}>
              <SelectTrigger><SelectValue placeholder="Branding wählen" /></SelectTrigger>
              <SelectContent>
                {brandings.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[280px]">
            <label className="text-sm font-medium text-muted-foreground">Fahrzeug</label>
            <Select value={selectedFahrzeug} onValueChange={setSelectedFahrzeug}>
              <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
              <SelectContent>
                {fahrzeuge.map((f) => (<SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {anfrageBetreff && (
          <div className="flex items-center gap-2">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Betreff</label>
              <Input value={anfrageBetreff} readOnly className="bg-muted" />
            </div>
            <Button variant="outline" size="icon" className="mt-6" onClick={() => handleCopy(anfrageBetreff, "Betreff")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {anfrageHtml && (
          <div className="border border-border rounded-md overflow-hidden bg-muted">
            <iframe srcDoc={anfrageHtml} title="Email Vorschau" className="w-full border-0" style={{ minHeight: 700 }} />
          </div>
        )}
      </div>

      {/* Marketing */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Marketing-Email</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Verkäufer</label>
            <Select value={marketingVerkaeufer} onValueChange={setMarketingVerkaeufer}>
              <SelectTrigger><SelectValue placeholder="Verkäufer wählen" /></SelectTrigger>
              <SelectContent>
                {verkaeufer.map((v) => (<SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Branding</label>
            <Select value={marketingBranding} onValueChange={setMarketingBranding}>
              <SelectTrigger><SelectValue placeholder="Branding wählen" /></SelectTrigger>
              <SelectContent>
                {brandings.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          {marketingHtml && (
            <Button variant="outline" onClick={() => handleCopy(marketingHtml, "HTML")}>
              <Copy className="mr-1.5 h-4 w-4" /> HTML kopieren
            </Button>
          )}
        </div>
        {marketingHtml && (
          <div className="flex items-center gap-2">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Betreff</label>
              <Input value={marketingBetreff} onChange={(e) => setMarketingBetreff(e.target.value)} />
            </div>
            <Button variant="outline" size="icon" className="mt-6" onClick={() => handleCopy(marketingBetreff, "Betreff")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {marketingHtml && (
          <div className="border border-border rounded-md overflow-hidden bg-muted">
            <iframe srcDoc={marketingHtml} title="Marketing Vorschau" className="w-full border-0" style={{ minHeight: 500 }} />
          </div>
        )}
      </div>

      {/* Servicebericht & Exposé */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Servicebericht & Exposé</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 min-w-[260px]">
            <label className="text-sm font-medium text-muted-foreground">Kunde</label>
            <Select value={svcKunde} onValueChange={setSvcKunde}>
              <SelectTrigger><SelectValue placeholder="Kunde wählen" /></SelectTrigger>
              <SelectContent>
                {anfragen.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.vorname} {a.nachname} – {a.fahrzeug_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Verkäufer</label>
            <Select value={svcVerkaeufer} onValueChange={setSvcVerkaeufer}>
              <SelectTrigger><SelectValue placeholder="Verkäufer wählen" /></SelectTrigger>
              <SelectContent>
                {verkaeufer.map((v) => (<SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Branding</label>
            <Select value={svcBranding} onValueChange={setSvcBranding}>
              <SelectTrigger><SelectValue placeholder="Branding wählen" /></SelectTrigger>
              <SelectContent>
                {brandings.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[260px]">
            <label className="text-sm font-medium text-muted-foreground">Fahrzeug</label>
            <Select value={svcFahrzeug} onValueChange={setSvcFahrzeug}>
              <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
              <SelectContent>
                {fahrzeuge.map((f) => (<SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          {svcHtml && (
            <Button variant="outline" onClick={() => handleCopy(svcHtml, "HTML")}>
              <Copy className="mr-1.5 h-4 w-4" /> HTML kopieren
            </Button>
          )}
        </div>
        {svcBetreff && (
          <div className="flex items-center gap-2">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Betreff</label>
              <Input value={svcBetreff} readOnly className="bg-muted" />
            </div>
            <Button variant="outline" size="icon" className="mt-6" onClick={() => handleCopy(svcBetreff, "Betreff")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {svcHtml && (
          <div className="border border-border rounded-md overflow-hidden bg-muted">
            <iframe srcDoc={svcHtml} title="Servicebericht Vorschau" className="w-full border-0" style={{ minHeight: 700 }} />
          </div>
        )}
      </div>

      {/* Persönliches Angebot */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Persönliches Angebot</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5 min-w-[260px]">
            <label className="text-sm font-medium text-muted-foreground">Kunde</label>
            <Select value={paKunde} onValueChange={setPaKunde}>
              <SelectTrigger><SelectValue placeholder="Kunde wählen" /></SelectTrigger>
              <SelectContent>
                {anfragen.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.vorname} {a.nachname} – {a.fahrzeug_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Verkäufer</label>
            <Select value={paVerkaeufer} onValueChange={setPaVerkaeufer}>
              <SelectTrigger><SelectValue placeholder="Verkäufer wählen" /></SelectTrigger>
              <SelectContent>
                {verkaeufer.map((v) => (<SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[220px]">
            <label className="text-sm font-medium text-muted-foreground">Branding</label>
            <Select value={paBranding} onValueChange={setPaBranding}>
              <SelectTrigger><SelectValue placeholder="Branding wählen" /></SelectTrigger>
              <SelectContent>
                {brandings.map((b) => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 min-w-[260px]">
            <label className="text-sm font-medium text-muted-foreground">Fahrzeug</label>
            <Select value={paFahrzeug} onValueChange={setPaFahrzeug}>
              <SelectTrigger><SelectValue placeholder="Fahrzeug wählen" /></SelectTrigger>
              <SelectContent>
                {fahrzeuge.map((f) => (<SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          {paHtml && (
            <Button variant="outline" onClick={() => handleCopy(paHtml, "HTML")}>
              <Copy className="mr-1.5 h-4 w-4" /> HTML kopieren
            </Button>
          )}
        </div>
        {paBetreff && (
          <div className="flex items-center gap-2">
            <div className="space-y-1.5 flex-1">
              <label className="text-sm font-medium text-muted-foreground">Betreff</label>
              <Input value={paBetreff} readOnly className="bg-muted" />
            </div>
            <Button variant="outline" size="icon" className="mt-6" onClick={() => handleCopy(paBetreff, "Betreff")}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
        {paHtml && (
          <div className="border border-border rounded-md overflow-hidden bg-muted">
            <iframe srcDoc={paHtml} title="Persönliches Angebot Vorschau" className="w-full border-0" style={{ minHeight: 700 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEmailTemplates;
