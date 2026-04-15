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

function drawStepIcon(doc: jsPDF, cx: number, cy: number, radius: number, step: number) {
  // Outer circle
  doc.setDrawColor(0);
  doc.setLineWidth(0.6);
  doc.circle(cx, cy, radius);

  // Step number
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(String(step), cx, cy + 1.5, { align: "center" });
}

async function generateInzahlungnahmePdf(
  verkaeufer: Verkaeufer,
  branding: Branding,
  kunde: { name: string; strasse: string; plzStadt: string },
  kundenfahrzeug: string
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

  const stepCenterY = boxY + 22;
  const stepSpacing = boxW / 4;
  const iconRadius = 10;

  const steps = [
    { num: 1, label: "Abholung", desc: ["Wir holen Ihr Fahrzeug", "kostenfrei bei Ihnen ab."] },
    { num: 2, label: "Prüfung", desc: ["Unser Expertenteam", "begutachtet Ihr Fahrzeug", "sorgfältig."] },
    { num: 3, label: "Rückgabe", desc: ["Ihr Fahrzeug wird", "kostenfrei an Sie", "zurückgebracht."] },
  ];

  steps.forEach((step, i) => {
    const cx = boxX + stepSpacing * (i + 1);

    // Draw circle icon
    doc.setFillColor(255, 255, 255);
    doc.circle(cx, stepCenterY, iconRadius, "FD");
    drawStepIcon(doc, cx, stepCenterY, iconRadius, step.num);

    // Connecting lines between circles
    if (i < steps.length - 1) {
      const nextCx = boxX + stepSpacing * (i + 2);
      doc.setDrawColor(180);
      doc.setLineWidth(0.5);
      const arrowY = stepCenterY;
      doc.line(cx + iconRadius + 2, arrowY, nextCx - iconRadius - 2, arrowY);
      // Arrow head
      const arrowTipX = nextCx - iconRadius - 2;
      doc.line(arrowTipX - 2, arrowY - 1.5, arrowTipX, arrowY);
      doc.line(arrowTipX - 2, arrowY + 1.5, arrowTipX, arrowY);
    }

    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text(step.label, cx, stepCenterY + iconRadius + 6, { align: "center" });

    // Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80, 80, 80);
    step.desc.forEach((line, li) => {
      doc.text(line, cx, stepCenterY + iconRadius + 11 + li * 3.5, { align: "center" });
    });
    doc.setTextColor(0);
  });

  y = boxY + boxH + 12;

  // ── Formal text ──
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const nachname = kunde.name.split(" ").pop() || kunde.name;

  const textLines = [
    `Sehr geehrte/r Herr/Frau ${nachname},`,
    "",
    `wir möchten Ihr Fahrzeug „${kundenfahrzeug}" gerne in Zahlung nehmen.`,
    "Zur Begutachtung und Bewertung holen wir das Fahrzeug kostenfrei",
    "bei Ihnen ab. Nach Abschluss der Prüfung wird das Fahrzeug",
    "selbstverständlich kostenfrei wieder an Sie zurückgebracht.",
    "",
    "Es entstehen Ihnen keinerlei Kosten.",
  ];

  textLines.forEach((line) => {
    doc.text(line, marginL, y);
    y += 5;
  });

  y += 15;

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
        kundenfahrzeug.trim()
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
