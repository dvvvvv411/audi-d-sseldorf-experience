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

function drawAudiRings(doc: jsPDF, x: number, y: number, scale: number = 1) {
  const r = 5.5 * scale;
  const overlap = 3.5 * scale;
  const cx1 = x;
  const cx2 = x + (2 * r - overlap);
  const cx3 = x + 2 * (2 * r - overlap);
  const cx4 = x + 3 * (2 * r - overlap);
  doc.setDrawColor(0);
  doc.setLineWidth(0.6 * scale);
  [cx1, cx2, cx3, cx4].forEach(cx => {
    doc.circle(cx, y, r, "S");
  });
}

async function cropImageToFill(base64: string, targetW: number, targetH: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const targetRatio = targetW / targetH;
      const imgRatio = img.width / img.height;
      let sx = 0, sy = 0, sw = img.width, sh = img.height;
      if (imgRatio > targetRatio) {
        sw = img.height * targetRatio;
        sx = (img.width - sw) / 2;
      } else {
        sh = img.width / targetRatio;
        sy = (img.height - sh) / 2;
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(targetW * 4);
      canvas.height = Math.round(targetH * 4);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}

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

  // Right: Audi Logo (drawn as 4 overlapping rings)
  drawAudiRings(doc, pageW - marginR - 30, 16, 1);

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
  const rawImageData = await Promise.all(imageUrls.map(loadImageAsBase64));

  // Crop images to fill their target dimensions without distortion
  const croppedBig = rawImageData[0] ? await cropImageToFill(rawImageData[0], bigW, totalImgH) : null;
  const croppedSmall = await Promise.all(
    [1, 2, 3, 4].map(i => rawImageData[i] ? cropImageToFill(rawImageData[i]!, smallW, smallH) : Promise.resolve(null))
  );

  // Big image (left)
  if (croppedBig) {
    doc.addImage(croppedBig, "JPEG", marginL, imgStartY, bigW, totalImgH);
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
    const pos = smallPositions[i];
    if (croppedSmall[i]) {
      doc.addImage(croppedSmall[i]!, "JPEG", pos.x, pos.y, smallW, smallH);
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

  const footerY = 252; // Fixed footer position
  const descLineH = 3.5;
  const availableDescH = footerY - y - 10; // space for description before footer
  const maxDescLines = Math.floor(availableDescH / descLineH);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const beschreibung = fahrzeug.beschreibung ?? "Keine Beschreibung vorhanden.";
  const descLines = doc.splitTextToSize(beschreibung, contentW);
  const linesToDraw = Math.min(descLines.length, maxDescLines);
  for (let i = 0; i < linesToDraw; i++) {
    doc.text(descLines[i], marginL, y);
    y += descLineH;
  }
  if (descLines.length > linesToDraw) {
    doc.text("...", marginL, y);
    y += descLineH;
  }

  // ── FOOTER (fixed position) ──
  y = footerY;
  drawLine(y);
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
  const priceStr = `${formatPrice(fahrzeug.preis)} €`;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const barpreisLabel = "Barpreis:";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const priceWidth = doc.getTextWidth(priceStr);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const labelWidth = doc.getTextWidth(barpreisLabel);
  
  const priceRight = priceX;
  const labelX = priceRight - priceWidth - labelWidth - 4;
  doc.text(barpreisLabel, labelX, footerStartY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(priceStr, priceRight, footerStartY + 1, { align: "right" });

  // MwSt line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("MwSt-Ausweis möglich!", priceRight, footerStartY + 8, { align: "right" });

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
