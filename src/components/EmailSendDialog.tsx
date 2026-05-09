import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, FileText, CheckCircle2, Send, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateExposePdf, type ExposeFahrzeug, type ExposeVerkaeufer, type ExposeBranding } from "@/lib/expose-pdf";
import { generateAngebotPdf } from "@/lib/angebot-pdf";

type TemplateKey = "servicebericht" | "angebot";

interface AnfrageLite {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  fahrzeug_id: string;
  verkaeufer_id: string;
  branding_name: string;
  strasse?: string | null;
  plz?: string | null;
  stadt?: string | null;
}

interface Props {
  anfrage: AnfrageLite | null;
  onClose: () => void;
  onSent: (anfrageId: string, newStatus: string) => void;
}

interface Attachment {
  filename: string;
  content_base64: string;
  size: number;
}

const buildAnrede = (gender: "male" | "female" | "unknown" | undefined, nachname: string) => {
  if (gender === "male") return `Sehr geehrter Herr ${nachname},`;
  if (gender === "female") return `Sehr geehrte Frau ${nachname},`;
  return `Sehr geehrte/r Herr/Frau ${nachname},`;
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(blob);
  });

const filenameFromUrl = (url: string, fallback: string) => {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").filter(Boolean).pop();
    return decodeURIComponent(last || fallback);
  } catch {
    return fallback;
  }
};

const generateServiceberichtHtml = (
  branding: { name: string; strasse: string; plz: string; stadt: string; amtsgericht: string; handelsregister: string; geschaeftsfuehrer: string; ust_id: string },
  verkaeufer: { vorname: string; nachname: string; email: string; telefon: string },
  fahrzeug: { fahrzeugname: string },
  anrede: string,
) => {
  const fullName = `${verkaeufer.vorname} ${verkaeufer.nachname}`;
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#333;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td style="padding:30px 20px 10px;">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;">
        <tr><td style="padding:0 0 20px;font-size:14px;line-height:1.7;color:#333;">
          ${anrede}<br/><br/>
          vielen Dank für das freundliche Telefonat sowie für Ihr Interesse an unserem Fahrzeug.<br/><br/>
          Wie besprochen sende ich Ihnen anbei den vollständigen Servicebericht sowie das ausführliche Exposé zum <strong>${fahrzeug.fahrzeugname}</strong>. Im Servicebericht finden Sie sämtliche dokumentierten Wartungs- und Servicearbeiten, die das Fahrzeug während seiner bisherigen Laufzeit erhalten hat. Das Exposé bietet Ihnen darüber hinaus einen detaillierten Überblick über die technischen Daten, die Ausstattungsmerkmale sowie die Historie des Fahrzeugs.<br/><br/>
          Bitte nehmen Sie sich in Ruhe die Zeit, beide Dokumente zu prüfen. Sollten im Anschluss noch Fragen offenbleiben oder Sie weitere Informationen wünschen, stehe ich Ihnen jederzeit gerne per E-Mail oder telefonisch unter <strong>${verkaeufer.telefon}</strong> zur Verfügung.<br/><br/>
          Falls Sie Interesse an einer Probefahrt haben, lässt sich diese kurzfristig und unverbindlich vereinbaren – gerne stimme ich mit Ihnen einen passenden Termin ab.<br/><br/>
          Ich freue mich darauf, von Ihnen zu hören.<br/><br/>
          Mit freundlichen Grüßen
        </td></tr>
        <tr><td style="padding:20px 0 0;border-top:1px solid #e0e0e0;">
          <p style="margin:0;font-size:14px;font-weight:bold;color:#000;">${fullName}</p>
          <p style="margin:2px 0 0;font-size:12px;color:#666;">Verkaufsberater | ${branding.name}</p>
          <p style="margin:4px 0 0;font-size:12px;color:#666;">${verkaeufer.telefon} · ${verkaeufer.email}</p>
        </td></tr>
        <tr><td style="padding:20px 0 0;">
          <img src="https://www.tiemeyer.de/media/uploads/2025/06/Audi.svg" alt="Audi" width="80" style="display:block;" />
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
</body></html>`;
};

const generateAngebotHtml = (
  branding: { name: string; strasse: string; plz: string; stadt: string; amtsgericht: string; handelsregister: string; geschaeftsfuehrer: string; ust_id: string },
  verkaeufer: { vorname: string; nachname: string; email: string; telefon: string },
  fahrzeug: { fahrzeugname: string },
  anrede: string,
) => {
  const fullName = `${verkaeufer.vorname} ${verkaeufer.nachname}`;
  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"></head>
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
          <img src="https://www.tiemeyer.de/media/uploads/2025/06/Audi.svg" alt="Audi" width="80" style="display:block;" />
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
</body></html>`;
};

export default function EmailSendDialog({ anfrage, onClose, onSent }: Props) {
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateKey>("servicebericht");

  const [fahrzeug, setFahrzeug] = useState<any>(null);
  const [verkaeufer, setVerkaeufer] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);
  const [anrede, setAnrede] = useState<string>("");
  const [loadingData, setLoadingData] = useState(false);

  const [preparing, setPreparing] = useState(false);
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [subject, setSubject] = useState<string>("");

  // Angebot-spezifische Felder
  const [nachlass, setNachlass] = useState<number>(0);
  const [unternehmen, setUnternehmen] = useState<string>("");
  const [strasse, setStrasse] = useState<string>("");
  const [plzStadt, setPlzStadt] = useState<string>("");

  // Reset wenn neue Anfrage
  useEffect(() => {
    if (!anfrage) return;
    setTemplate("servicebericht");
    setAttachments([]);
    setPreviewHtml("");
    setSubject("");
    setNachlass(0);
    setUnternehmen("");
    setStrasse(anfrage.strasse || "");
    setPlzStadt(anfrage.plz && anfrage.stadt ? `${anfrage.plz} ${anfrage.stadt}` : (anfrage.stadt || ""));
    (async () => {
      setLoadingData(true);
      try {
        const [fRes, vRes, brRes] = await Promise.all([
          supabase.from("fahrzeuge").select("*").eq("id", anfrage.fahrzeug_id).maybeSingle(),
          supabase.from("verkaeufer").select("*").eq("id", anfrage.verkaeufer_id).maybeSingle(),
          supabase.from("brandings").select("*").eq("name", anfrage.branding_name).maybeSingle(),
        ]);
        setFahrzeug(fRes.data);
        setVerkaeufer(vRes.data);
        setBranding(brRes.data);

        // Anrede via detect-gender
        try {
          const { data: g } = await supabase.functions.invoke("detect-gender", {
            body: { vorname: anfrage.vorname },
          });
          setAnrede(buildAnrede((g as any)?.gender, anfrage.nachname));
        } catch {
          setAnrede(buildAnrede("unknown", anfrage.nachname));
        }
      } finally {
        setLoadingData(false);
      }
    })();
  }, [anfrage?.id]);

  const handlePrepare = async () => {
    if (!anfrage || !fahrzeug || !verkaeufer || !branding) return;
    setPreparing(true);
    setAttachments([]);
    setPreviewHtml("");
    try {
      if (template === "servicebericht") {
        // 1) Exposé generieren
        const exposeBlob = await generateExposePdf(
          fahrzeug as ExposeFahrzeug,
          verkaeufer as ExposeVerkaeufer,
          branding as ExposeBranding,
        );
        const exposeB64 = await blobToBase64(exposeBlob);
        const safeName = fahrzeug.fahrzeugname.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
        const atts: Attachment[] = [{
          filename: `${safeName}_Expose.pdf`,
          content_base64: exposeB64,
          size: exposeBlob.size,
        }];

        // 2) Servicenachweise
        const urls: string[] = (fahrzeug.servicenachweis_urls as string[] | null) ?? [];
        for (let i = 0; i < urls.length; i++) {
          try {
            const resp = await fetch(urls[i]);
            const blob = await resp.blob();
            const b64 = await blobToBase64(blob);
            atts.push({
              filename: filenameFromUrl(urls[i], `Servicenachweis_${i + 1}.pdf`),
              content_base64: b64,
              size: blob.size,
            });
          } catch (err) {
            console.error("Servicenachweis-Download fehlgeschlagen:", err);
          }
        }

        setAttachments(atts);
        setSubject(`Servicebericht & Exposé – ${fahrzeug.fahrzeugname}`);
        setPreviewHtml(generateServiceberichtHtml(branding, verkaeufer, fahrzeug, anrede));
      } else {
        // Angebot
        const angebotBlob = await generateAngebotPdf(
          fahrzeug as any,
          verkaeufer as any,
          branding as any,
          {
            name: `${anfrage.vorname} ${anfrage.nachname}`,
            firma: unternehmen,
            strasse,
            plzStadt,
          },
          nachlass || 0,
        );
        const b64 = await blobToBase64(angebotBlob);
        const safeName = fahrzeug.fahrzeugname.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
        setAttachments([{
          filename: `${safeName}_Angebot.pdf`,
          content_base64: b64,
          size: angebotBlob.size,
        }]);
        setSubject(`Ihr persönliches Angebot – ${fahrzeug.fahrzeugname}`);
        setPreviewHtml(generateAngebotHtml(branding, verkaeufer, fahrzeug, anrede));
      }
      toast({ title: "Vorbereitung abgeschlossen" });
    } catch (err) {
      console.error(err);
      toast({ title: "Fehler", description: "Vorbereitung fehlgeschlagen.", variant: "destructive" });
    } finally {
      setPreparing(false);
    }
  };

  const handleSend = async () => {
    if (!anfrage || !verkaeufer || !branding) return;
    setSending(true);
    try {
      const { data: emailRes, error: emailErr } = await supabase.functions.invoke("send-template-email", {
        body: {
          branding_id: branding.id,
          verkaeufer_id: verkaeufer.id,
          to: anfrage.email,
          subject,
          html: previewHtml,
          attachments: attachments.map((a) => ({ filename: a.filename, content_base64: a.content_base64 })),
          anfrage_id: anfrage.id,
        },
      });
      if (emailErr || (emailRes as any)?.error) {
        const msg = (emailRes as any)?.error || emailErr?.message || "Email fehlgeschlagen";
        throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }

      const newStatus = template === "servicebericht" ? "Service gesendet" : "Angebot gesendet";
      await supabase.from("anfragen").update({ status: newStatus }).eq("id", anfrage.id);

      const senderLabel = branding.sevenio_absendername || branding.name;
      const smsText = template === "servicebericht"
        ? `Hallo ${anfrage.vorname}, wir haben Ihnen soeben Exposé und Servicenachweis per Email zugeschickt.\n${senderLabel}`
        : `Hallo ${anfrage.vorname}, wir haben Ihnen soeben Ihr persönliches Angebot per Email zugeschickt.\n${senderLabel}`;

      try {
        await supabase.functions.invoke("send-anfrage-sms", {
          body: {
            branding_id: branding.id,
            anfrage_id: anfrage.id,
            telefon: anfrage.telefon,
            vorname: anfrage.vorname,
            verkaeufer_name: `${verkaeufer.vorname} ${verkaeufer.nachname}`,
            text_override: smsText,
          },
        });
      } catch (smsErr) {
        console.error("SMS fehlgeschlagen:", smsErr);
      }

      toast({ title: "Email versendet", description: `Status auf "${newStatus}" gesetzt.` });
      onSent(anfrage.id, newStatus);
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Fehler beim Versand",
        description: err instanceof Error ? err.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const fromHeaderPreview = verkaeufer && branding
    ? `${verkaeufer.vorname} ${verkaeufer.nachname} - ${branding.name} <${verkaeufer.email}>`
    : "—";

  const formatKb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <Dialog open={!!anfrage} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email senden – {anfrage ? `${anfrage.vorname} ${anfrage.nachname}` : ""}</DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin w-6 h-6 text-gray-400" /></div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Email-Vorlage</label>
              <Select value={template} onValueChange={(v) => { setTemplate(v as TemplateKey); setAttachments([]); setPreviewHtml(""); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="servicebericht">Servicebericht & Exposé</SelectItem>
                  <SelectItem value="angebot">Persönliches Angebot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-xs text-gray-600 space-y-1">
              <div><span className="font-medium text-gray-700">Empfänger:</span> {anfrage?.email}</div>
              <div><span className="font-medium text-gray-700">Absender:</span> {fromHeaderPreview}</div>
              <div><span className="font-medium text-gray-700">Anrede:</span> {anrede || "—"}</div>
            </div>

            {template === "angebot" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Nachlass (€)</label>
                  <Input type="number" min={0} value={nachlass} onChange={(e) => setNachlass(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Unternehmen (optional)</label>
                  <Input value={unternehmen} onChange={(e) => setUnternehmen(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Straße + Hausnummer (optional)</label>
                  <Input value={strasse} onChange={(e) => setStrasse(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">PLZ + Stadt (optional)</label>
                  <Input value={plzStadt} onChange={(e) => setPlzStadt(e.target.value)} />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handlePrepare} disabled={preparing || !fahrzeug || !verkaeufer || !branding}>
                {preparing ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {preparing ? "Wird vorbereitet…" : (previewHtml ? "Erneut vorbereiten" : "Vorbereiten & Vorschau")}
              </Button>
            </div>

            {previewHtml && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Betreff</label>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-xs text-emerald-800 space-y-1">
                  {attachments.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <Paperclip className="w-3.5 h-3.5" />
                      <span className="font-medium">{a.filename}</span>
                      <span className="text-emerald-600">({formatKb(a.size)})</span>
                    </div>
                  ))}
                  {attachments.length === 0 && <div>Keine Anhänge.</div>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">Vorschau</label>
                  <iframe
                    srcDoc={previewHtml}
                    className="w-full border border-gray-200 rounded-md bg-white"
                    style={{ minHeight: 500 }}
                    title="Email-Vorschau"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSend} disabled={sending} className="bg-gray-900 text-white hover:bg-gray-800">
                    {sending ? <Loader2 className="animate-spin w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {sending ? "Wird versendet…" : "Email senden"}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
