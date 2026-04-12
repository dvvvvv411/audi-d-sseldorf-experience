import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
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

const AUDI_LOGO_SVG = `data:image/svg+xml;base64,${btoa(`<svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="25" r="20" stroke="black" stroke-width="3"/><circle cx="73" cy="25" r="20" stroke="black" stroke-width="3"/><circle cx="106" cy="25" r="20" stroke="black" stroke-width="3"/><circle cx="139" cy="25" r="20" stroke="black" stroke-width="3"/></svg>`)}`;

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "–";
  // Handle formats like "2024-10-30" or "10.2024" or "30.10.2024"
  return dateStr;
};

const formatKm = (km: number | null) => {
  if (km === null) return "–";
  return new Intl.NumberFormat("de-DE").format(km);
};

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

function getSupabaseImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  const { data } = supabase.storage.from("fahrzeuge").getPublicUrl(path);
  return data.publicUrl;
}

async function generateExposePdf(
  fahrzeug: Fahrzeug,
  verkaeufer: Verkaeufer,
  branding: Branding
): Promise<Blob> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const marginL = 15;
  const marginR = 15;
  const contentW = pageW - marginL - marginR;
  let y = 12;

  // ── Helper ──
  const drawLine = (yPos: number) => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(marginL, yPos, pageW - marginR, yPos);
  };

  // ── HEADER ──
  // Left: Branding info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(branding.name, marginL, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  y += 5;
  doc.text(branding.strasse, marginL, y);
  y += 4;
  doc.text(`${branding.plz} ${branding.stadt}`, marginL, y);
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(`${verkaeufer.vorname} ${verkaeufer.nachname}`, marginL, y);
  doc.setFont("helvetica", "normal");
  y += 4;
  doc.text(`Telefon: ${verkaeufer.telefon}`, marginL, y);
  y += 4;
  doc.text(`eMail: ${verkaeufer.email}`, marginL, y);

  // Right: Audi Logo
  try {
    doc.addImage(AUDI_LOGO_SVG, "SVG", pageW - marginR - 40, 10, 40, 10);
  } catch {
    // fallback: draw rings text
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Audi", pageW - marginR - 20, 18);
  }

  y += 6;
  drawLine(y);

  // ── FAHRZEUGNAME ──
  y += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(fahrzeug.fahrzeugname, pageW / 2, y, { align: "center" });
  y += 6;
  drawLine(y);

  // ── BILDER ──
  y += 3;
  const imgStartY = y;
  const totalImgH = 75;
  const gap = 3;
  const bigW = 108;
  const rightW = contentW - bigW - gap; // ~69mm
  const smallW = (rightW - gap) / 2; // ~33mm
  const smallH = (totalImgH - gap) / 2; // ~36mm

  const bilder = fahrzeug.bilder ?? [];
  const imageUrls = bilder.slice(0, 5).map(getSupabaseImageUrl);
  const imageData = await Promise.all(imageUrls.map(loadImageAsBase64));

  // Big image (left)
  if (imageData[0]) {
    doc.addImage(imageData[0], "JPEG", marginL, imgStartY, bigW, totalImgH);
  } else {
    doc.setFillColor(230, 230, 230);
    doc.rect(marginL, imgStartY, bigW, totalImgH, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Kein Bild", marginL + bigW / 2, imgStartY + totalImgH / 2, { align: "center" });
  }

  // Small images (right, 2x2)
  const smallPositions = [
    { x: marginL + bigW + gap, y: imgStartY },
    { x: marginL + bigW + gap + smallW + gap, y: imgStartY },
    { x: marginL + bigW + gap, y: imgStartY + smallH + gap },
    { x: marginL + bigW + gap + smallW + gap, y: imgStartY + smallH + gap },
  ];

  for (let i = 0; i < 4; i++) {
    const imgIdx = i + 1;
    const pos = smallPositions[i];
    if (imageData[imgIdx]) {
      doc.addImage(imageData[imgIdx], "JPEG", pos.x, pos.y, smallW, smallH);
    } else {
      doc.setFillColor(230, 230, 230);
      doc.rect(pos.x, pos.y, smallW, smallH, "F");
    }
  }

  y = imgStartY + totalImgH + 4;
  drawLine(y);

  // ── FAHRZEUGDATEN ──
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Fahrzeugdaten:", marginL, y);
  y += 2;
  drawLine(y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const colLabelL = marginL;
  const colValL = marginL + 30;
  const colLabelR = marginL + contentW / 2 + 5;
  const colValR = marginL + contentW / 2 + 35;
  const rowH = 4.5;

  const leftData = [
    ["Farbe:", fahrzeug.farbe ?? "–"],
    ["kW/(PS):", fahrzeug.kw && fahrzeug.ps ? `${fahrzeug.kw}/(${fahrzeug.ps})` : "–"],
    ["Hubraum:", fahrzeug.hubraum ? `${new Intl.NumberFormat("de-DE").format(fahrzeug.hubraum)}` : "–"],
    ["km-Stand:", formatKm(fahrzeug.km_stand)],
    ["Motor/Antrieb:", [fahrzeug.kraftstoff, fahrzeug.getriebe].filter(Boolean).join(" ") || "–"],
  ];

  const rightData = [
    ["Innenausstattung:", fahrzeug.innenausstattung ?? "–"],
    ["Türen/Sitze:", fahrzeug.tueren && fahrzeug.sitze ? `${fahrzeug.tueren}/${fahrzeug.sitze}` : "–"],
    ["Erstzulassung:", formatDate(fahrzeug.erstzulassung)],
    ["TÜV/AU:", formatDate(fahrzeug.tuev_au)],
    ["Auftragsnummer:", fahrzeug.auftragsnummer ?? "–"],
  ];

  for (let i = 0; i < 5; i++) {
    doc.setFont("helvetica", "bold");
    doc.text(leftData[i][0], colLabelL, y);
    doc.setFont("helvetica", "normal");
    doc.text(leftData[i][1], colValL, y);
    doc.setFont("helvetica", "bold");
    doc.text(rightData[i][0], colLabelR, y);
    doc.setFont("helvetica", "normal");
    doc.text(rightData[i][1], colValR, y);
    y += rowH;
  }

  y += 2;
  drawLine(y);

  // ── BESCHREIBUNG ──
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Serien- und Sonderausstattung:", marginL, y);
  y += 2;
  drawLine(y);
  y += 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const beschreibung = fahrzeug.beschreibung ?? "Keine Beschreibung vorhanden.";
  const descLines = doc.splitTextToSize(beschreibung, contentW);
  const maxDescLines = Math.min(descLines.length, 12);
  for (let i = 0; i < maxDescLines; i++) {
    doc.text(descLines[i], marginL, y);
    y += 3;
  }
  if (descLines.length > maxDescLines) {
    doc.text("...", marginL, y);
    y += 3;
  }

  y += 2;
  drawLine(y);

  // ── FOOTER ──
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const disclaimerLines = [
    "Da wir uns Zwischenverkauf vorbehalten",
    "müssen, empfehlen wir Ihnen, vor einer",
    "Besichtigung beim genannten Ansprech-",
    "partner telefonisch rückzufragen, ob",
    "das Fahrzeug noch unverkauft ist.",
  ];
  const footerStartY = y;
  for (const line of disclaimerLines) {
    doc.text(line, marginL, y);
    y += 3.5;
  }

  // Price section (right side, same line as disclaimer start)
  const priceX = pageW - marginR;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const barpreisLabel = "Barpreis:";
  const barpreisLabelWidth = doc.getTextWidth(barpreisLabel);
  const priceStr = `${formatPrice(fahrzeug.preis)} €`;

  // Calculate positions: "Barpreis:" then price in large font next to it
  doc.setFontSize(10);
  doc.text(barpreisLabel, priceX - doc.getTextWidth(priceStr) - barpreisLabelWidth - 8, footerStartY, { align: "left" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(priceStr, priceX, footerStartY + 1, { align: "right" });

  // MwSt line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("MwSt-Ausweis möglich!", priceX, footerStartY + 8, { align: "right" });

  // Created date + disclaimer
  y += 4;
  doc.setFontSize(7);
  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  doc.text(`Erstellt am: ${today}`, marginL, y);
  y += 3.5;
  doc.text("Zwischenverkauf und Irrtum vorbehalten!", marginL, y);

  return doc.output("blob");
}

const AdminExposes = () => {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [brandings, setBrandings] = useState<Branding[]>([]);

  const [selectedFahrzeugId, setSelectedFahrzeugId] = useState("");
  const [selectedVerkaeuferId, setSelectedVerkaeuferId] = useState("");
  const [selectedBrandingId, setSelectedBrandingId] = useState("");

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
      setFahrzeuge((fRes.data as Fahrzeug[]) ?? []);
      setVerkaeufer((vRes.data as Verkaeufer[]) ?? []);
      setBrandings((bRes.data as Branding[]) ?? []);
    };
    fetchData();
  }, []);

  const selectedFahrzeug = fahrzeuge.find((f) => f.id === selectedFahrzeugId);
  const selectedVerkaeuferObj = verkaeufer.find((v) => v.id === selectedVerkaeuferId);
  const selectedBrandingObj = brandings.find((b) => b.id === selectedBrandingId);

  const canGenerate = selectedFahrzeug && selectedVerkaeuferObj && selectedBrandingObj;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    try {
      const blob = await generateExposePdf(selectedFahrzeug, selectedVerkaeuferObj, selectedBrandingObj);
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setPdfBlob(blob);
      toast.success("Exposé wurde erstellt");
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Erstellen des Exposés");
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
    a.download = `${safeName}_Expose.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fahrzeug */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Fahrzeug</label>
          <Select value={selectedFahrzeugId} onValueChange={setSelectedFahrzeugId}>
            <SelectTrigger><SelectValue placeholder="Fahrzeug wählen…" /></SelectTrigger>
            <SelectContent>
              {fahrzeuge.map((f) => (
                <SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Verkäufer */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Verkäufer</label>
          <Select value={selectedVerkaeuferId} onValueChange={setSelectedVerkaeuferId}>
            <SelectTrigger><SelectValue placeholder="Verkäufer wählen…" /></SelectTrigger>
            <SelectContent>
              {verkaeufer.map((v) => (
                <SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Branding */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Branding</label>
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

      <div className="flex gap-3">
        <Button onClick={handleGenerate} disabled={!canGenerate || generating}>
          {generating ? <Loader2 className="animate-spin" /> : <FileText />}
          {generating ? "Wird erstellt…" : "Exposé erstellen"}
        </Button>
        {pdfBlob && (
          <Button variant="outline" onClick={handleDownload}>
            <Download />
            PDF herunterladen
          </Button>
        )}
      </div>

      {pdfBlobUrl && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white" style={{ height: "80vh" }}>
          <iframe src={pdfBlobUrl} className="w-full h-full" title="Exposé Vorschau" />
        </div>
      )}
    </div>
  );
};

export default AdminExposes;
