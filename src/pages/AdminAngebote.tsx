import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { generateAngebotPdf } from "@/lib/angebot-pdf";

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



const AdminAngebote = () => {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [brandings, setBrandings] = useState<Branding[]>([]);

  const [searchParams] = useSearchParams();

  const [selectedFahrzeugId, setSelectedFahrzeugId] = useState("");
  const [selectedVerkaeuferId, setSelectedVerkaeuferId] = useState("");
  const [selectedBrandingId, setSelectedBrandingId] = useState("");

  const [interessentName, setInteressentName] = useState("");
  const [interessentFirma, setInteressentFirma] = useState("");
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
      const paramFirma = searchParams.get("firma");
      const paramStrasse = searchParams.get("strasse");
      const paramPlzStadt = searchParams.get("plzstadt");

      if (paramFahrzeug && fData.some((f) => f.id === paramFahrzeug)) setSelectedFahrzeugId(paramFahrzeug);
      if (paramVerkaeufer && vData.some((v) => v.id === paramVerkaeufer)) setSelectedVerkaeuferId(paramVerkaeufer);
      if (paramBranding) {
        const match = bData.find((b) => b.name === paramBranding);
        if (match) setSelectedBrandingId(match.id);
      }
      if (paramName) setInteressentName(decodeURIComponent(paramName));
      if (paramFirma) setInteressentFirma(decodeURIComponent(paramFirma));
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
    interessentName.trim();

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setGenerating(true);
    try {
      const blob = await generateAngebotPdf(
        selectedFahrzeug,
        selectedVerkaeuferObj,
        selectedBrandingObj,
        { name: interessentName, firma: interessentFirma, strasse: interessentStrasse, plzStadt: interessentPlzStadt },
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Voller Name (Interessent)</label>
          <Input value={interessentName} onChange={(e) => setInteressentName(e.target.value)} placeholder="Max Mustermann" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Unternehmensname (optional)</label>
          <Input value={interessentFirma} onChange={(e) => setInteressentFirma(e.target.value)} placeholder="Firma GmbH" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Straße + Hausnummer (optional)</label>
          <Input value={interessentStrasse} onChange={(e) => setInteressentStrasse(e.target.value)} placeholder="Musterstr. 1" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">PLZ + Stadt (optional)</label>
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
