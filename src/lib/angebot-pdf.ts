import jsPDF from "jspdf";

export interface AngebotFahrzeug {
  id: string;
  fahrzeugname: string;
  preis: number;
  farbe: string | null;
  km_stand: number | null;
  getriebe: string | null;
  tueren: number | null;
  erstzulassung: string | null;
  beschreibung: string | null;
}

export interface AngebotVerkaeufer {
  vorname: string;
  nachname: string;
  telefon: string;
}

export interface AngebotBranding {
  name: string;
  strasse: string;
  plz: string;
  stadt: string;
}

export interface AngebotInteressent {
  name: string;
  firma: string;
  strasse: string;
  plzStadt: string;
}

const formatEur = (n: number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const formatKm = (km: number | null) => {
  if (km === null) return "–";
  return new Intl.NumberFormat("de-DE").format(km);
};

export function generateAngebotNr(): string {
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

export async function generateAngebotPdf(
  fahrzeug: AngebotFahrzeug,
  verkaeufer: AngebotVerkaeufer,
  branding: AngebotBranding,
  interessent: AngebotInteressent,
  nachlass: number,
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

  const [audiLogo, gwPlusImg] = await Promise.all([
    loadAudiLogoAsBase64(),
    loadImageAsBase64("/images/audi_gwplus.jpg"),
  ]);

  // SEITE 1 – Deckblatt
  let y = 15;
  if (audiLogo) {
    const logoH = 12;
    const logoW = logoH * (284 / 99);
    doc.addImage(audiLogo, "PNG", pageW - marginR - logoW, 12, logoW, logoH);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Audi AG", marginL, y); y += 4;
  doc.text(branding.strasse, marginL, y); y += 4;
  doc.text(`${branding.plz} ${branding.stadt}`, marginL, y); y += 8;

  doc.text(`Ansprechpartner: ${verkaeufer.vorname} ${verkaeufer.nachname}`, marginL, y); y += 4;
  doc.text(`Telefon: ${verkaeufer.telefon}`, marginL, y); y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Angebot", marginL, y); y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`für ${interessent.name}`, marginL, y); y += 5;
  if (interessent.firma.trim()) { doc.text(interessent.firma, marginL, y); y += 5; }
  if (interessent.strasse.trim()) { doc.text(interessent.strasse, marginL, y); y += 5; }
  if (interessent.plzStadt.trim()) { doc.text(interessent.plzStadt, marginL, y); y += 5; }
  y += 5;

  drawLine(y); y += 8;

  if (gwPlusImg) {
    const imgW = contentW;
    const imgEl = new Image();
    const imgH = await new Promise<number>((resolve) => {
      imgEl.onload = () => resolve(imgW * (imgEl.naturalHeight / imgEl.naturalWidth));
      imgEl.onerror = () => resolve(imgW * 0.45);
      imgEl.src = gwPlusImg;
    });
    doc.addImage(gwPlusImg, "JPEG", marginL, y, imgW, imgH);
    y += imgH + 6;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Sprechen Sie Ihren Verkäufer über die detaillierten Inhalte des Programms an.", marginL, y);
  doc.setFontSize(7);
  doc.text("AOG_02_01", pageW - marginR, 285, { align: "right" });

  // SEITE 2 – Preisangebot
  doc.addPage();
  y = 15;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("- 2 -", pageW / 2, y, { align: "center" }); y += 8;

  doc.setFontSize(9);
  doc.text(`Angebot Nr. ${angebotNr} vom ${today} an ${interessent.name}`, marginL, y); y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Unser Privat-Angebot", marginL, y); y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const introText = "Unter Zugrundelegung der derzeit gültigen Verkaufsbedingungen unterbreiten wir Ihnen nachfolgendes, unverbindliches Angebot:";
  const introLines = doc.splitTextToSize(introText, contentW);
  for (const line of introLines) { doc.text(line, marginL, y); y += 4; }
  y += 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(fahrzeug.fahrzeugname, marginL, y); y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(fahrzeugDetails, marginL, y); y += 4;
  doc.text(fahrzeugEzKm, marginL, y); y += 10;

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
  doc.text("Alle Werte inkl. gesetzlicher Mehrwertsteuer.", marginL, y); y += 10;

  doc.setFontSize(9);
  doc.text("Bei Fragen oder Anmerkungen wenden Sie sich bitte an:", marginL, y); y += 5;
  doc.text(`${verkaeufer.vorname} ${verkaeufer.nachname}, Tel. ${verkaeufer.telefon}`, marginL, y); y += 10;

  doc.text("Wir freuen uns auf Ihre Entscheidung und würden Sie gerne bald wieder bei uns begrüßen.", marginL, y); y += 8;
  doc.text("Mit freundlichen Grüßen", marginL, y);

  // SEITE 3+ – Sonderausstattungen
  const beschreibung = fahrzeug.beschreibung ?? "";
  if (beschreibung.trim()) {
    const equipmentLines = beschreibung.split("\n").filter((l) => l.trim());
    let pageNum = 3;

    const startEquipmentPage = () => {
      doc.addPage();
      let py = 15;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`- ${pageNum} -`, pageW / 2, py, { align: "center" }); py += 8;
      doc.text(`Angebot Nr. ${angebotNr} vom ${today} an ${interessent.name}`, marginL, py); py += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(fahrzeug.fahrzeugname, marginL, py); py += 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(fahrzeugDetails, marginL, py); py += 4;
      doc.text(fahrzeugEzKm, marginL, py); py += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Die Sonderausstattungen:", marginL, py); py += 6;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);

      pageNum++;
      return py;
    };

    y = startEquipmentPage();
    const maxY = 265;
    const lineH = 4;

    for (const line of equipmentLines) {
      const wrappedLines = doc.splitTextToSize(line.trim(), contentW);
      const blockH = wrappedLines.length * lineH;
      if (y + blockH > maxY) {
        y = startEquipmentPage();
      }
      for (const wl of wrappedLines) {
        doc.text(wl, marginL, y);
        y += lineH;
      }
    }
  }

  return doc.output("blob");
}
