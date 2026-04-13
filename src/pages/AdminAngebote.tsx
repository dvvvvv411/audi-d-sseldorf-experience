import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Fahrzeug {
  id: string;
  fahrzeugname: string;
  preis: number;
  farbe: string | null;
  kw: number | null;
  ps: number | null;
  hubraum: number | null;
  km_stand: number | null;
  kraftstoff: string | null;
  getriebe: string | null;
  antrieb: string | null;
  innenausstattung: string | null;
  tueren: number | null;
  sitze: number | null;
  erstzulassung: string | null;
  tuev_au: string | null;
  auftragsnummer: string | null;
  beschreibung: string | null;
  bilder: string[] | null;
  fahrgestellnummer: string | null;
}

interface Verkaeufer {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  branding_id: string | null;
}

interface Branding {
  id: string;
  name: string;
  strasse: string;
  plz: string;
  stadt: string;
  email: string;
}

const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const formatKm = (km: number | null) => {
  if (km === null) return "–";
  return new Intl.NumberFormat("de-DE").format(km);
};

function generateAngebotNr(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${yy}${mm}${dd}${rand}`;
}

async function loadAudiLogoAsBase64(): Promise<string | null> {
  try {
    const response = await fetch("/images/Audi.svg");
    const svgText = await response.text();
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = Math.round(800 * (99 / 284));
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(null);
      const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
      img.src = URL.createObjectURL(blob);
    });
  } catch {
    return null;
  }
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

async function generateAngebotPdf(
  fahrzeug: Fahrzeug,
  verkaeufer: Verkaeufer,
  branding: Branding,
  interessent: { name: string; strasse: string; plzStadt: string },
  nachlass: number
): Promise<Blob> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const marginL = 20;
  const marginR = 20;
  const contentW = pageW - marginL - marginR;

  const angebotNr = generateAngebotNr();
  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  const zwischensumme = fahrzeug.preis - nachlass;
  const gesamtsumme = zwischensumme;

  const fahrzeugDetails = `${fahrzeug.tueren ?? "–"} Türen, ${fahrzeug.getriebe ?? "–"}, Lackierung: ${fahrzeug.farbe ?? "–"}`;
  const fahrzeugEzKm = `Erstzulassung: ${fahrzeug.erstzulassung ?? "–"}, Gesamtfahrleistung: ${formatKm(fahrzeug.km_stand)} km`;

  const drawLine = (yPos: number) => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(marginL, yPos, pageW - marginR, yPos);
  };

  // Load assets
  const [audiLogo, gwPlusImg] = await Promise.all([
    loadAudiLogoAsBase64(),
    loadImageAsBase64("/images/audi_gwplus.jpg"),
  ]);

  // ═══════════════════════════════════════════════
  // SEITE 1 – Deckblatt
  // ═══════════════════════════════════════════════
  let y = 15;

  // Audi Logo top right
  if (audiLogo) {
    const logoH = 12;
    const logoW = logoH * (284 / 99);
    doc.addImage(audiLogo, "PNG", pageW - marginR - logoW, 12, logoW, logoH);
  }

  // Branding address
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Audi AG", marginL, y);
  y += 4;
  doc.text(branding.strasse, marginL, y);
  y += 4;
  doc.text(`${branding.plz} ${branding.stadt}`, marginL, y);
  y += 8;

  // Ansprechpartner
  doc.text(`Ansprechpartner: ${verkaeufer.vorname} ${verkaeufer.nachname}`, marginL, y);
  y += 4;
  doc.text(`Telefon: ${verkaeufer.telefon}`, marginL, y);
  y += 10;

  // "Angebot" heading
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Angebot", marginL, y);
  y += 8;

  // Interessent
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`für ${interessent.name}`, marginL, y);
  y += 5;
  if (interessent.strasse.trim()) {
    doc.text(interessent.strasse, marginL, y);
    y += 5;
  }
  doc.text(interessent.plzStadt, marginL, y);
  y += 10;

  drawLine(y);
  y += 8;

  // GW Plus image
  if (gwPlusImg) {
    const imgW = contentW;
    // Calculate actual aspect ratio from image
    const imgEl = new Image();
    const imgH = await new Promise<number>((resolve) => {
      imgEl.onload = () => resolve(imgW * (imgEl.naturalHeight / imgEl.naturalWidth));
      imgEl.onerror = () => resolve(imgW * 0.45);
      imgEl.src = gwPlusImg;
    });
    doc.addImage(gwPlusImg, "JPEG", marginL, y, imgW, imgH);
    y += imgH + 6;
  }

  // Footer text page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Sprechen Sie Ihren Verkäufer über die detaillierten Inhalte des Programms an.", marginL, y);

  // Page code bottom right
  doc.setFontSize(7);
  doc.text("AOG_02_01", pageW - marginR, 285, { align: "right" });

  // ═══════════════════════════════════════════════
  // SEITE 2 – Preisangebot
  // ═══════════════════════════════════════════════
  doc.addPage();
  y = 15;

  // Page number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("- 2 -", pageW / 2, y, { align: "center" });
  y += 8;

  // Angebot header
  doc.setFontSize(9);
  doc.text(`Angebot Nr. ${angebotNr} vom ${today} an ${interessent.name}`, marginL, y);
  y += 10;

  // "Unser Privat-Angebot"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Unser Privat-Angebot", marginL, y);
  y += 8;

  // Intro text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const introText = "Unter Zugrundelegung der derzeit gültigen Verkaufsbedingungen unterbreiten wir Ihnen nachfolgendes, unverbindliches Angebot:";
  const introLines = doc.splitTextToSize(introText, contentW);
  for (const line of introLines) {
    doc.text(line, marginL, y);
    y += 4;
  }
  y += 4;

  // Fahrzeugname bold
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(fahrzeug.fahrzeugname, marginL, y);
  y += 5;

  // Details
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(fahrzeugDetails, marginL, y);
  y += 4;
  doc.text(fahrzeugEzKm, marginL, y);
  y += 10;

  // Price table
  const priceTableX = marginL;
  const labelW = 90;
  const eurX = priceTableX + labelW;
  const valX = pageW - marginR;

  const drawPriceRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(9);
    doc.text(label, priceTableX, y);
    doc.text("EUR", eurX, y);
    doc.text(value, valX, y, { align: "right" });
    y += 5;
  };

  drawPriceRow("Fahrzeugpreis", formatEur(fahrzeug.preis), true);
  if (nachlass > 0) {
    drawPriceRow("- Nachlass", formatEur(nachlass), false);
    drawPriceRow("Zwischensumme", formatEur(zwischensumme), true);
  }
  drawPriceRow("Kostenlose Lieferung", "0,00", false);
  drawPriceRow("Gesamtsumme", formatEur(gesamtsumme), true);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Alle Werte inkl. gesetzlicher Mehrwertsteuer.", marginL, y);
  y += 10;

  // Contact
  doc.setFontSize(9);
  doc.text("Bei Fragen oder Anmerkungen wenden Sie sich bitte an:", marginL, y);
  y += 5;
  doc.text(`${verkaeufer.vorname} ${verkaeufer.nachname}, Tel. ${verkaeufer.telefon}`, marginL, y);
  y += 10;

  doc.text("Wir freuen uns auf Ihre Entscheidung und würden Sie gerne bald wieder bei uns begrüßen.", marginL, y);
  y += 8;
  doc.text("Mit freundlichen Grüßen", marginL, y);

  // ═══════════════════════════════════════════════
  // SEITE 3+ – Sonderausstattungen
  // ═══════════════════════════════════════════════
  const beschreibung = fahrzeug.beschreibung ?? "";
  if (beschreibung.trim()) {
    const equipmentLines = beschreibung.split("\n").filter((l) => l.trim());
    let pageNum = 3;

    const startEquipmentPage = () => {
      doc.addPage();
      let py = 15;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`- ${pageNum} -`, pageW / 2, py, { align: "center" });
      py += 8;
      doc.text(`Angebot Nr. ${angebotNr} vom ${today} an ${interessent.name}`, marginL, py);
      py += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(fahrzeug.fahrzeugname, marginL, py);
      py += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(fahrzeugDetails, marginL, py);
      py += 4;
      doc.text(fahrzeugEzKm, marginL, py);
      py += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Die Sonderausstattungen:", marginL, py);
      py += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      pageNum++;
      return py;
    };

    y = startEquipmentPage();
    const maxY = 265;
    const lineH = 4;

    for (const line of equipmentLines) {
      if (y + lineH > maxY) {
        // Disclaimer on bottom before page break won't fit, start new page
        y = startEquipmentPage();
      }
      doc.text(line.trim(), marginL, y);
      y += lineH;
    }

  }

  return doc.output("blob");
}

const AdminAngebote = () => {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [brandings, setBrandings] = useState<Branding[]>([]);

  const [searchParams] = useSearchParams();

  const [selectedFahrzeugId, setSelectedFahrzeugId] = useState("");
  const [selectedVerkaeuferId, setSelectedVerkaeuferId] = useState("");
  const [selectedBrandingId, setSelectedBrandingId] = useState("");

  const [interessentName, setInteressentName] = useState("");
  const [interessentStrasse, setInteressentStrasse] = useState("");
  const [interessentPlzStadt, setInteressentPlzStadt] = useState("");
  const [nachlass, setNachlass] = useState(0);

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [fRes, vRes, bRes] = await Promise.all([
        supabase.from("fahrzeuge").select("*").eq("aktiv", true).order("fahrzeugname"),
        supabase.from("verkaeufer").select("*").order("nachname"),
        supabase.from("brandings").select("*").order("name"),
      ]);
      const fData = (fRes.data as Fahrzeug[]) ?? [];
      const vData = (vRes.data as Verkaeufer[]) ?? [];
      const bData = (bRes.data as Branding[]) ?? [];
      setFahrzeuge(fData);
      setVerkaeufer(vData);
      setBrandings(bData);

      // Prefill from URL params
      const paramFahrzeug = searchParams.get("fahrzeug");
      const paramVerkaeufer = searchParams.get("verkaeufer");
      const paramBranding = searchParams.get("branding");
      const paramName = searchParams.get("name");
      const paramStrasse = searchParams.get("strasse");
      const paramPlzStadt = searchParams.get("plzstadt");

      if (paramFahrzeug && fData.some((f) => f.id === paramFahrzeug)) setSelectedFahrzeugId(paramFahrzeug);
      if (paramVerkaeufer && vData.some((v) => v.id === paramVerkaeufer)) setSelectedVerkaeuferId(paramVerkaeufer);
      if (paramBranding) {
        const match = bData.find((b) => b.name === paramBranding);
        if (match) setSelectedBrandingId(match.id);
      }
      if (paramName) setInteressentName(decodeURIComponent(paramName));
      if (paramStrasse) setInteressentStrasse(decodeURIComponent(paramStrasse));
      if (paramPlzStadt) setInteressentPlzStadt(decodeURIComponent(paramPlzStadt));
    };
    fetchData();
  }, [searchParams]);

  const selectedFahrzeug = fahrzeuge.find((f) => f.id === selectedFahrzeugId);
  const selectedVerkaeuferObj = verkaeufer.find((v) => v.id === selectedVerkaeuferId);
  const selectedBrandingObj = brandings.find((b) => b.id === selectedBrandingId);

  const canGenerate =
    selectedFahrzeug &&
    selectedVerkaeuferObj &&
    selectedBrandingObj &&
    interessentName.trim() &&
    interessentPlzStadt.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    try {
      const blob = await generateAngebotPdf(
        selectedFahrzeug,
        selectedVerkaeuferObj,
        selectedBrandingObj,
        { name: interessentName, strasse: interessentStrasse, plzStadt: interessentPlzStadt },
        nachlass
      );
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setPdfBlob(blob);
      toast.success("Angebot wurde erstellt");
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Erstellen des Angebots");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob || !selectedFahrzeug) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = selectedFahrzeug.fahrzeugname.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
    const safePerson = interessentName.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
    a.download = `${safeName}_Angebot_${safePerson}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Select row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Fahrzeug</label>
          <Select value={selectedFahrzeugId} onValueChange={setSelectedFahrzeugId}>
            <SelectTrigger><SelectValue placeholder="Fahrzeug wählen…" /></SelectTrigger>
            <SelectContent>
              {fahrzeuge.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Verkäufer</label>
          <Select value={selectedVerkaeuferId} onValueChange={setSelectedVerkaeuferId}>
            <SelectTrigger><SelectValue placeholder="Verkäufer wählen…" /></SelectTrigger>
            <SelectContent>
              {verkaeufer.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Branding</label>
          <Select value={selectedBrandingId} onValueChange={setSelectedBrandingId}>
            <SelectTrigger><SelectValue placeholder="Branding wählen…" /></SelectTrigger>
            <SelectContent>
              {brandings.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Interessent + Nachlass */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Voller Name (Interessent)</label>
          <Input value={interessentName} onChange={(e) => setInteressentName(e.target.value)} placeholder="Max Mustermann" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Straße + Hausnummer (optional)</label>
          <Input value={interessentStrasse} onChange={(e) => setInteressentStrasse(e.target.value)} placeholder="Musterstr. 1" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">PLZ + Stadt</label>
          <Input value={interessentPlzStadt} onChange={(e) => setInteressentPlzStadt(e.target.value)} placeholder="12345 Musterstadt" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Nachlass (EUR)</label>
          <Input
            type="number"
            min={0}
            value={nachlass}
            onChange={(e) => setNachlass(Math.max(0, Number(e.target.value) || 0))}
            placeholder="0"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleGenerate} disabled={!canGenerate || generating}>
          {generating ? <Loader2 className="animate-spin" /> : <FileText />}
          {generating ? "Wird erstellt…" : "Angebot erstellen"}
        </Button>
        {pdfBlob && (
          <Button variant="outline" onClick={handleDownload}>
            <Download />
            PDF herunterladen
          </Button>
        )}
      </div>

      {/* Preview */}
      {pdfBlobUrl && (
        <div className="border border-border rounded-lg overflow-hidden bg-background" style={{ height: "80vh" }}>
          <iframe src={pdfBlobUrl} className="w-full h-full" title="Angebot Vorschau" />
        </div>
      )}
    </div>
  );
};

export default AdminAngebote;
