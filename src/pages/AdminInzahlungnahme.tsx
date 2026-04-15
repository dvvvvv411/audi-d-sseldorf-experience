import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface Verkaeufer {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
}

interface Branding {
  id: string;
  name: string;
  strasse: string;
  plz: string;
  stadt: string;
  email: string;
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

// ── Icon drawing functions ──

function drawPickupIcon(doc: jsPDF, cx: number, cy: number) {
  // Car body
  doc.setDrawColor(40);
  doc.setLineWidth(0.8);
  doc.setFillColor(40, 40, 40);

  // Car body (lower rectangle)
  const bw = 11, bh = 4;
  doc.roundedRect(cx - bw / 2, cy - 1, bw, bh, 1, 1, "S");

  // Car roof (upper trapezoid as rounded rect)
  const rw = 7, rh = 3.5;
  doc.roundedRect(cx - rw / 2, cy - 4.5, rw, rh, 1, 1, "S");

  // Wheels
  doc.setFillColor(40, 40, 40);
  doc.circle(cx - 3.2, cy + 3.5, 1.5, "F");
  doc.circle(cx + 3.2, cy + 3.5, 1.5, "F");

  // Arrow pointing right (pickup direction)
  const arrowY = cy - 7;
  doc.setLineWidth(0.7);
  doc.line(cx - 3, arrowY, cx + 4, arrowY);
  doc.line(cx + 2, arrowY - 2, cx + 4, arrowY);
  doc.line(cx + 2, arrowY + 2, cx + 4, arrowY);
}

function drawInspectionIcon(doc: jsPDF, cx: number, cy: number) {
  doc.setDrawColor(40);
  doc.setLineWidth(0.8);

  // Magnifying glass circle
  const glassR = 5;
  doc.circle(cx - 1, cy - 2, glassR, "S");

  // Handle
  doc.setLineWidth(1.2);
  const handleAngle = Math.PI / 4;
  const hx1 = cx - 1 + Math.cos(handleAngle) * glassR;
  const hy1 = cy - 2 + Math.sin(handleAngle) * glassR;
  doc.line(hx1, hy1, hx1 + 4, hy1 + 4);

  // Checkmark inside the glass
  doc.setLineWidth(0.9);
  doc.setDrawColor(40);
  const checkCx = cx - 1, checkCy = cy - 2;
  doc.line(checkCx - 2.5, checkCy, checkCx - 0.5, checkCy + 2.5);
  doc.line(checkCx - 0.5, checkCy + 2.5, checkCx + 3, checkCy - 2);
}

function drawReturnIcon(doc: jsPDF, cx: number, cy: number) {
  doc.setDrawColor(40);
  doc.setLineWidth(0.8);

  // House outline
  const hw = 12, hh = 8;
  const roofPeak = cy - 6;
  const houseTop = cy - 1;
  const houseBottom = houseTop + hh;

  // Roof (triangle)
  doc.line(cx - hw / 2 - 1, houseTop, cx, roofPeak); // left slope
  doc.line(cx, roofPeak, cx + hw / 2 + 1, houseTop); // right slope

  // Walls
  doc.line(cx - hw / 2, houseTop, cx - hw / 2, houseBottom);
  doc.line(cx + hw / 2, houseTop, cx + hw / 2, houseBottom);
  doc.line(cx - hw / 2, houseBottom, cx + hw / 2, houseBottom);

  // Door
  const dw = 3, dh = 4.5;
  doc.rect(cx - dw / 2, houseBottom - dh, dw, dh, "S");

  // Arrow pointing left (return direction) below
  const arrowY = houseBottom + 3.5;
  doc.setLineWidth(0.7);
  doc.line(cx + 3, arrowY, cx - 4, arrowY);
  doc.line(cx - 2, arrowY - 2, cx - 4, arrowY);
  doc.line(cx - 2, arrowY + 2, cx - 4, arrowY);
}

async function generateInzahlungnahmePdf(
  verkaeufer: Verkaeufer,
  branding: Branding,
  kunde: { name: string; strasse: string; plzStadt: string },
  kundenfahrzeug: string,
  anrede: "Herr" | "Frau"
): Promise<Blob> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const marginL = 20;
  const marginR = 20;
  const contentW = pageW - marginL - marginR;

  const today = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });

  const drawLine = (yPos: number) => {
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.line(marginL, yPos, pageW - marginR, yPos);
  };

  const audiLogo = await loadAudiLogoAsBase64();

  let y = 15;

  // ── Header: Audi Logo top right ──
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
  y += 4;
  doc.text(`E-Mail: ${verkaeufer.email}`, marginL, y);
  y += 10;

  drawLine(y);
  y += 12;

  // ── Title ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("I N Z A H L U N G N A H M E", pageW / 2, y, { align: "center" });
  y += 12;

  // ── Kunde ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Kunde: ${kunde.name}`, marginL, y);
  y += 5;
  if (kunde.strasse.trim()) {
    doc.text(kunde.strasse, marginL, y);
    y += 5;
  }
  if (kunde.plzStadt.trim()) {
    doc.text(kunde.plzStadt, marginL, y);
    y += 5;
  }
  y += 3;

  // ── Fahrzeug ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Fahrzeug: ${kundenfahrzeug}`, marginL, y);
  y += 8;

  drawLine(y);
  y += 10;

  // ── 3-Step Visual Workflow Box ──
  const boxX = marginL;
  const boxY = y;
  const boxW = contentW;
  const boxH = 70;

  // Background box
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(200);
  doc.setLineWidth(0.4);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "FD");

  const stepCenterY = boxY + 24;
  const stepSpacing = boxW / 4;

  const steps = [
    { label: "Abholung", desc: ["Wir holen Ihr Fahrzeug", "kostenfrei bei Ihnen ab."], drawIcon: drawPickupIcon },
    { label: "Prüfung", desc: ["Unser Expertenteam", "begutachtet Ihr Fahrzeug", "sorgfältig."], drawIcon: drawInspectionIcon },
    { label: "Rückgabe", desc: ["Ihr Fahrzeug wird", "kostenfrei an Sie", "zurückgebracht."], drawIcon: drawReturnIcon },
  ];

  steps.forEach((step, i) => {
    const cx = boxX + stepSpacing * (i + 1);

    // Draw thematic icon
    step.drawIcon(doc, cx, stepCenterY);

    // Connecting arrows between icons
    if (i < steps.length - 1) {
      const nextCx = boxX + stepSpacing * (i + 2);
      doc.setDrawColor(160);
      doc.setLineWidth(0.5);
      const arrowY = stepCenterY;
      const startX = cx + 9;
      const endX = nextCx - 9;
      doc.line(startX, arrowY, endX, arrowY);
      // Arrow head
      doc.line(endX - 2, arrowY - 1.5, endX, arrowY);
      doc.line(endX - 2, arrowY + 1.5, endX, arrowY);
    }

    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(step.label, cx, stepCenterY + 14, { align: "center" });

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    step.desc.forEach((line, li) => {
      doc.text(line, cx, stepCenterY + 19 + li * 3.5, { align: "center" });
    });
    doc.setTextColor(0);
  });

  y = boxY + boxH + 12;

  // ── Formal text (full-width) ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const nachname = kunde.name.split(" ").pop() || kunde.name;

  const anredeText = anrede === "Herr" ? `Sehr geehrter Herr ${nachname},` : `Sehr geehrte Frau ${nachname},`;

  doc.text(anredeText, marginL, y);
  y += 8;

  const bodyText = `wir möchten Ihr Fahrzeug „${kundenfahrzeug}" gerne in Zahlung nehmen. Zur Begutachtung und Bewertung holen wir das Fahrzeug kostenfrei bei Ihnen ab. Nach Abschluss der Prüfung wird das Fahrzeug selbstverständlich kostenfrei wieder an Sie zurückgebracht.`;

  const bodyLines = doc.splitTextToSize(bodyText, contentW);
  doc.text(bodyLines, marginL, y);
  y += bodyLines.length * 5;

  y += 3;
  const closingText = "Es entstehen Ihnen keinerlei Kosten.";
  doc.text(closingText, marginL, y);

  y += 20;

  // ── Signature lines ──
  doc.setDrawColor(0);
  doc.setLineWidth(0.3);

  // Date
  doc.line(marginL, y, marginL + 50, y);
  doc.setFontSize(8);
  doc.text("Datum", marginL, y + 5);

  // Seller signature
  doc.line(pageW - marginR - 70, y, pageW - marginR, y);
  doc.text("Unterschrift Verkäufer", pageW - marginR - 70, y + 5);

  // ── Footer ──
  const footerY = 278;
  drawLine(footerY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Audi AG · ${branding.strasse} · ${branding.plz} ${branding.stadt}`,
    marginL,
    footerY + 5
  );
  doc.text(`Erstellt am ${today}`, pageW - marginR, footerY + 5, { align: "right" });
  doc.setTextColor(0);

  return doc.output("blob");
}

const AdminInzahlungnahme = () => {
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [brandings, setBrandings] = useState<Branding[]>([]);

  const [selectedVerkaeuferId, setSelectedVerkaeuferId] = useState("");
  const [selectedBrandingId, setSelectedBrandingId] = useState("");
  const [anrede, setAnrede] = useState<"Herr" | "Frau">("Herr");
  const [kundenname, setKundenname] = useState("");
  const [kundenfahrzeug, setKundenfahrzeug] = useState("");
  const [strasse, setStrasse] = useState("");
  const [plzStadt, setPlzStadt] = useState("");

  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [vRes, bRes] = await Promise.all([
        supabase.from("verkaeufer").select("*").order("nachname"),
        supabase.from("brandings").select("*").order("name"),
      ]);
      setVerkaeufer((vRes.data as Verkaeufer[]) ?? []);
      setBrandings((bRes.data as Branding[]) ?? []);
    };
    fetchData();
  }, []);

  const selectedVerkaeuferObj = verkaeufer.find((v) => v.id === selectedVerkaeuferId);
  const selectedBrandingObj = brandings.find((b) => b.id === selectedBrandingId);

  const canGenerate =
    selectedVerkaeuferObj &&
    selectedBrandingObj &&
    kundenname.trim() &&
    kundenfahrzeug.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    try {
      const blob = await generateInzahlungnahmePdf(
        selectedVerkaeuferObj,
        selectedBrandingObj,
        { name: kundenname.trim(), strasse: strasse.trim(), plzStadt: plzStadt.trim() },
        kundenfahrzeug.trim(),
        anrede
      );
      if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
      const url = URL.createObjectURL(blob);
      setPdfBlobUrl(url);
      setPdfBlob(blob);
      toast.success("Inzahlungnahme-Dokument wurde erstellt");
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Erstellen des Dokuments");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = kundenfahrzeug.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
    a.download = `Inzahlungnahme_${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Anrede</label>
          <Select value={anrede} onValueChange={(v) => setAnrede(v as "Herr" | "Frau")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Herr">Herr</SelectItem>
              <SelectItem value="Frau">Frau</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Kundenname</label>
          <Input value={kundenname} onChange={(e) => setKundenname(e.target.value)} placeholder="Hans Beispiel" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Kundenfahrzeug</label>
          <Input value={kundenfahrzeug} onChange={(e) => setKundenfahrzeug(e.target.value)} placeholder="BMW 320d Touring" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Straße (optional)</label>
          <Input value={strasse} onChange={(e) => setStrasse(e.target.value)} placeholder="Musterweg 5" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">PLZ + Stadt (optional)</label>
          <Input value={plzStadt} onChange={(e) => setPlzStadt(e.target.value)} placeholder="54321 Beispielstadt" />
        </div>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleGenerate} disabled={!canGenerate || generating}>
          {generating ? <Loader2 className="animate-spin" /> : <FileText />}
          {generating ? "Wird erstellt…" : "Dokument erstellen"}
        </Button>
        {pdfBlob && (
          <Button variant="outline" onClick={handleDownload}>
            <Download />
            PDF herunterladen
          </Button>
        )}
      </div>

      {pdfBlobUrl && (
        <div className="border border-border rounded-lg overflow-hidden bg-background" style={{ height: "80vh" }}>
          <iframe src={pdfBlobUrl} className="w-full h-full" title="Inzahlungnahme Vorschau" />
        </div>
      )}
    </div>
  );
};

export default AdminInzahlungnahme;
