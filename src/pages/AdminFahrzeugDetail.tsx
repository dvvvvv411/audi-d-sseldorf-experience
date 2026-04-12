import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Car, Fuel, Gauge, Palette, Cog, Zap, Calendar,
  CreditCard, Hash, ImageIcon, FileText, DoorOpen, Armchair,
  Settings, X, Upload, File, ToggleLeft, ToggleRight, Check
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

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
  fahrgestellnummer: string | null;
  beschreibung: string | null;
  bilder: string[] | null;
  servicenachweis_urls: string[] | null;
  created_at: string;
}

const parseBeschreibung = (text: string | null) => {
  if (!text) return [];
  const sections = text.split("***").filter(Boolean);
  return sections.map((section) => {
    const colonIdx = section.indexOf(":");
    if (colonIdx === -1) return { title: section.trim(), items: [] };
    const title = section.substring(0, colonIdx).trim();
    const itemsStr = section.substring(colonIdx + 1).trim();
    const items = itemsStr
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    return { title, items };
  });
};

export default function AdminFahrzeugDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fahrzeug, setFahrzeug] = useState<Fahrzeug | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [formatted, setFormatted] = useState(true);
  const [pdfViewer, setPdfViewer] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const loadFahrzeug = async () => {
    if (!id) return;
    const { data } = await supabase.from("fahrzeuge").select("*").eq("id", id).single();
    if (data) setFahrzeug(data as any);
    setLoading(false);
  };

  useEffect(() => {
    loadFahrzeug();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!fahrzeug) {
    return <p className="text-gray-500">Fahrzeug nicht gefunden.</p>;
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0 }).format(p);

  const IconBadge = ({ icon: Icon, color }: { icon: any; color: string }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
  );

  const DetailRow = ({ icon, iconColor, label, value }: { icon: any; iconColor: string; label: string; value: string | null | undefined }) => (
    <div className="flex items-center gap-3 py-2.5">
      <IconBadge icon={icon} color={iconColor} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value || "–"}</p>
      </div>
    </div>
  );

  const bilder = fahrzeug.bilder || [];
  const servicenachweise = fahrzeug.servicenachweis_urls || [];
  const beschreibungSections = parseBeschreibung(fahrzeug.beschreibung);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;
    setUploadingPdf(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      if (file.type !== "application/pdf") {
        toast.error(`${file.name} ist keine PDF-Datei`);
        continue;
      }
      const path = `servicenachweise/${id}/${crypto.randomUUID()}_${file.name}`;
      const { error } = await supabase.storage.from("fahrzeuge").upload(path, file);
      if (error) {
        toast.error(`Fehler beim Hochladen: ${file.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from("fahrzeuge").getPublicUrl(path);
      newUrls.push(urlData.publicUrl);
    }

    if (newUrls.length > 0) {
      const updated = [...servicenachweise, ...newUrls];
      const { error } = await supabase
        .from("fahrzeuge")
        .update({ servicenachweis_urls: updated } as any)
        .eq("id", id);
      if (error) {
        toast.error("Fehler beim Speichern");
      } else {
        toast.success("PDF hochgeladen");
        loadFahrzeug();
      }
    }
    setUploadingPdf(false);
    e.target.value = "";
  };

  const removePdf = async (urlToRemove: string) => {
    if (!id) return;
    const updated = servicenachweise.filter((u) => u !== urlToRemove);
    const { error } = await supabase
      .from("fahrzeuge")
      .update({ servicenachweis_urls: updated } as any)
      .eq("id", id);
    if (error) {
      toast.error("Fehler beim Entfernen");
    } else {
      toast.success("PDF entfernt");
      loadFahrzeug();
    }
  };

  const getPdfFilename = (url: string) => {
    const parts = url.split("/");
    const last = parts[parts.length - 1];
    // Remove UUID prefix if present
    const uuidPattern = /^[a-f0-9-]{36}_/;
    return decodeURIComponent(last.replace(uuidPattern, ""));
  };

  return (
    <div className="max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/fahrzeugbestand")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zum Fahrzeugbestand
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{fahrzeug.fahrzeugname}</h2>
            <p className="text-lg font-semibold text-emerald-600">{formatPrice(fahrzeug.preis)} €</p>
          </div>
        </div>
      </div>

      {/* Row 1: Technische Daten + Bilder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Technische Daten */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-500" />
              Technische Daten
            </h3>
            <div className="grid grid-cols-2 gap-x-4">
              <DetailRow icon={Gauge} iconColor="bg-emerald-50 text-emerald-600" label="KM-Stand" value={fahrzeug.km_stand ? `${new Intl.NumberFormat("de-DE").format(fahrzeug.km_stand)} km` : null} />
              <DetailRow icon={Calendar} iconColor="bg-emerald-50 text-emerald-600" label="Erstzulassung" value={fahrzeug.erstzulassung} />
              <DetailRow icon={Fuel} iconColor="bg-emerald-50 text-emerald-600" label="Kraftstoff" value={fahrzeug.kraftstoff} />
              <DetailRow icon={Cog} iconColor="bg-emerald-50 text-emerald-600" label="Getriebe" value={fahrzeug.getriebe} />
              <DetailRow icon={Zap} iconColor="bg-emerald-50 text-emerald-600" label="Leistung" value={fahrzeug.kw && fahrzeug.ps ? `${fahrzeug.kw} kW / ${fahrzeug.ps} PS` : null} />
              <DetailRow icon={Gauge} iconColor="bg-emerald-50 text-emerald-600" label="Hubraum" value={fahrzeug.hubraum ? `${new Intl.NumberFormat("de-DE").format(fahrzeug.hubraum)} ccm` : null} />
              <DetailRow icon={Car} iconColor="bg-emerald-50 text-emerald-600" label="Antrieb" value={fahrzeug.antrieb} />
              <DetailRow icon={Palette} iconColor="bg-emerald-50 text-emerald-600" label="Farbe" value={fahrzeug.farbe} />
              <DetailRow icon={Armchair} iconColor="bg-emerald-50 text-emerald-600" label="Innenausstattung" value={fahrzeug.innenausstattung} />
              <DetailRow icon={DoorOpen} iconColor="bg-emerald-50 text-emerald-600" label="Türen" value={fahrzeug.tueren ? String(fahrzeug.tueren) : null} />
              <DetailRow icon={Armchair} iconColor="bg-emerald-50 text-emerald-600" label="Sitze" value={fahrzeug.sitze ? String(fahrzeug.sitze) : null} />
              <DetailRow icon={Calendar} iconColor="bg-emerald-50 text-emerald-600" label="TÜV/AU" value={fahrzeug.tuev_au} />
              <DetailRow icon={CreditCard} iconColor="bg-emerald-50 text-emerald-600" label="Auftragsnummer" value={fahrzeug.auftragsnummer} />
              <DetailRow icon={Hash} iconColor="bg-emerald-50 text-emerald-600" label="Fahrgestellnummer" value={fahrzeug.fahrgestellnummer} />
            </div>

            {/* Servicenachweis(e) */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <File className="w-4 h-4 text-emerald-500" />
                  Servicenachweis(e)
                </h4>
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" className="gap-1.5" asChild>
                    <span>
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingPdf ? "Laden…" : "PDF hochladen"}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handlePdfUpload}
                    className="hidden"
                    disabled={uploadingPdf}
                  />
                </label>
              </div>

              {servicenachweise.length === 0 ? (
                <p className="text-gray-400 text-sm">Keine Servicenachweise vorhanden.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {servicenachweise.map((url, i) => (
                    <div
                      key={i}
                      className="relative group flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setPdfViewer(url)}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded bg-red-50 text-red-500 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-gray-700 truncate flex-1">{getPdfFilename(url)}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePdf(url);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bilder */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-blue-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-500" />
              Bilder ({bilder.length})
            </h3>
            {bilder.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Keine Bilder vorhanden.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {bilder.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 hover:border-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <img src={url} alt={`Bild ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Beschreibung */}
      {fahrzeug.beschreibung && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-amber-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Serien- und Sonderausstattung
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={() => setFormatted(!formatted)}
              >
                {formatted ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                {formatted ? "Rohtext" : "Formatiert"}
              </Button>
            </div>

            {formatted && beschreibungSections.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {beschreibungSections.map((section, i) => (
                  <div key={i} className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-gray-800 mb-2">{section.title}</p>
                    {section.items.length > 0 ? (
                      <ul className="space-y-1">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">Keine Details</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{fahrzeug.beschreibung}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-2 bg-black/95 border-none">
          {lightboxIndex !== null && bilder[lightboxIndex] && (
            <div className="relative">
              <img
                src={bilder[lightboxIndex]}
                alt={`Bild ${lightboxIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain rounded"
              />
              <div className="flex justify-center gap-2 mt-3">
                {bilder.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setLightboxIndex(i)}
                    className={`w-16 h-12 rounded overflow-hidden border-2 transition-colors ${i === lightboxIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={pdfViewer !== null} onOpenChange={() => setPdfViewer(null)}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden">
          {pdfViewer && (
            <iframe
              src={pdfViewer}
              className="w-full h-full"
              title="Servicenachweis PDF"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
