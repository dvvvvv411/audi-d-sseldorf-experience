import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Tables } from "@/integrations/supabase/types";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Car, Gauge, Calendar, Zap, Fuel, Settings2,
  Palette, Cog, Star, Mail, Phone, Check, Menu, ArrowLeft
} from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";

type Fahrzeug = Tables<"fahrzeuge">;
type Verkaeufer = Tables<"verkaeufer">;
type Branding = Tables<"brandings">;

interface VerkaeuferMitBranding extends Verkaeufer {
  branding?: Branding | null;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0 }).format(price);

const formatKm = (km: number) =>
  new Intl.NumberFormat("de-DE").format(km);

const formatErstzulassung = (ez: string | null) => {
  if (!ez) return "–";
  // Handle dd.mm.yyyy format
  const dotMatch = ez.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    return `${dotMatch[2].padStart(2, "0")}/${dotMatch[3]}`;
  }
  // Handle yyyy-mm-dd or other parseable formats
  const d = new Date(ez);
  if (!isNaN(d.getTime())) {
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  }
  return ez;
};

const parseBeschreibung = (text: string | null) => {
  if (!text) return [];
  // Split by *** to get sections
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

function ThumbnailGallery({ bilder, fahrzeugname, mainImage, onSelect }: {
  bilder: string[];
  fahrzeugname: string;
  mainImage: string | null;
  onSelect: (img: string) => void;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback(() => {
    if (!emblaApi) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    onScroll();
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
    };
  }, [emblaApi, onScroll]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-0">
          {bilder.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelect(img)}
              className={`flex-shrink-0 overflow-hidden relative ${
                mainImage === img ? "ring-2 ring-[#00527a] ring-inset" : ""
              }`}
            >
              <img
                src={img}
                alt={`${fahrzeugname} Bild ${i + 1}`}
                className="h-16 w-28 md:h-28 md:w-48 object-cover"
              />
              <div className="absolute inset-0 z-10" />
            </button>
          ))}
        </div>
      </div>
      {/* Progress Bar overlaid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <div
          className="h-full bg-[#00527a] transition-all duration-150"
          style={{ width: `${Math.max(10, (1 / Math.max(bilder.length - 4, 1)) * 100)}%`, marginLeft: `${scrollProgress * (100 - (1 / Math.max(bilder.length - 4, 1)) * 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function Gebrauchtwagen() {
  usePageMeta("Gebrauchtwagen · Audi Düsseldorf", "Geprüfte Audi Gebrauchtwagen in Düsseldorf. Alle Modelle mit Garantie und Top-Ausstattung.");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sellerSlug, auftragsnummer } = useParams<{ sellerSlug?: string; auftragsnummer?: string }>();
  const [fahrzeug, setFahrzeug] = useState<Fahrzeug | null>(null);
  const [verkaeufer, setVerkaeufer] = useState<VerkaeuferMitBranding[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Anfrage Dialog
  const [anfrageOpen, setAnfrageOpen] = useState(false);
  const [anfrageForm, setAnfrageForm] = useState({ vorname: "", nachname: "", email: "", telefon: "", nachricht: "" });
  const [datenschutz, setDatenschutz] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetAnfrageForm = () => {
    setAnfrageForm({ vorname: "", nachname: "", email: "", telefon: "", nachricht: "" });
    setDatenschutz(false);
  };

  const handleAnfrageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fahrzeug || !verkaeufer[0] || !datenschutz) return;
    setSubmitting(true);
    const v = verkaeufer[0];
    const { error } = await supabase.from("anfragen").insert({
      vorname: anfrageForm.vorname.trim(),
      nachname: anfrageForm.nachname.trim(),
      email: anfrageForm.email.trim(),
      telefon: anfrageForm.telefon.trim(),
      nachricht: anfrageForm.nachricht.trim(),
      datenschutz_akzeptiert: true,
      fahrzeug_id: fahrzeug.id,
      fahrzeug_name: fahrzeug.fahrzeugname,
      fahrzeug_preis: fahrzeug.preis,
      auftragsnummer: fahrzeug.auftragsnummer || null,
      verkaeufer_id: v.id,
      verkaeufer_name: `${v.vorname} ${v.nachname}`,
      branding_name: v.branding?.name || "–",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Fehler", description: "Anfrage konnte nicht gesendet werden.", variant: "destructive" });
    } else {
      toast({ title: "Anfrage gesendet", description: "Wir melden uns bei Ihnen." });
      resetAnfrageForm();
      setAnfrageOpen(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (sellerSlug && auftragsnummer) {
        // Dynamic seller route: /gebrauchtwagen/:sellerSlug/:auftragsnummer
        const parts = sellerSlug.split("_");
        if (parts.length < 2) { setLoading(false); return; }
        const vorname = parts[0];
        const nachname = parts.slice(1).join("_");

        // Find seller by name
        const { data: sellerData } = await supabase
          .from("verkaeufer")
          .select("*")
          .ilike("vorname", vorname)
          .ilike("nachname", nachname)
          .single();

        if (!sellerData) { setLoading(false); return; }

        // Load branding for the seller
        let branding: Branding | null = null;
        if (sellerData.branding_id) {
          const { data: b } = await supabase
            .from("brandings")
            .select("*")
            .eq("id", sellerData.branding_id)
            .single();
          branding = b;
        }
        setVerkaeufer([{ ...sellerData, branding }]);

        // Find the vehicle assigned to this seller with matching auftragsnummer
        const { data: links } = await supabase
          .from("verkaeufer_fahrzeuge")
          .select("fahrzeug_id")
          .eq("verkaeufer_id", sellerData.id);

        if (links && links.length > 0) {
          const fahrzeugIds = links.map((l) => l.fahrzeug_id);
          const { data: fz } = await supabase
            .from("fahrzeuge")
            .select("*")
            .in("id", fahrzeugIds)
            .eq("auftragsnummer", auftragsnummer)
            .single();

          if (fz) {
            setFahrzeug(fz);
            if (fz.bilder && fz.bilder.length > 0) {
              setMainImage(fz.bilder[0]);
            }
          }
        }
      } else {
        // Fallback: load first vehicle (original behavior)
        const { data: fz } = await supabase
          .from("fahrzeuge")
          .select("*")
          .limit(1)
          .single();

        if (fz) {
          setFahrzeug(fz);
          if (fz.bilder && fz.bilder.length > 0) {
            setMainImage(fz.bilder[0]);
          }

          const { data: links } = await supabase
            .from("verkaeufer_fahrzeuge")
            .select("verkaeufer_id")
            .eq("fahrzeug_id", fz.id);

          if (links && links.length > 0) {
            const ids = links.map((l) => l.verkaeufer_id);
            const { data: sellers } = await supabase
              .from("verkaeufer")
              .select("*")
              .in("id", ids);

            if (sellers) {
              const sellersWithBranding: VerkaeuferMitBranding[] = await Promise.all(
                sellers.map(async (s) => {
                  if (s.branding_id) {
                    const { data: b } = await supabase
                      .from("brandings")
                      .select("*")
                      .eq("id", s.branding_id)
                      .single();
                    return { ...s, branding: b };
                  }
                  return { ...s, branding: null };
                })
              );
              setVerkaeufer(sellersWithBranding);
            }
          }
        }
      }
      setLoading(false);
    };
    load();
  }, [sellerSlug, auftragsnummer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="animate-pulse opacity-40">
          <svg width="80" height="28" viewBox="0 0 69 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M57.0623 21.3142C54.9409 21.3142 52.9856 20.5922 51.422 19.3822C53.0087 17.3448 53.9585 14.7826 53.9585 12C53.9585 9.21768 53.0087 6.65544 51.422 4.61784C52.9856 3.408 54.9409 2.68584 57.0623 2.68584C62.1714 2.68584 66.3281 6.86424 66.3281 12C66.3281 17.136 62.1714 21.3142 57.0623 21.3142ZM36.3802 19.3822C37.9672 17.3448 38.917 14.7826 38.917 12C38.917 9.21768 37.9672 6.65544 36.3804 4.61784C37.9438 3.408 39.8997 2.68584 42.0208 2.68584C44.1421 2.68584 46.0975 3.408 47.6611 4.61784C46.0743 6.65544 45.1246 9.21768 45.1246 12C45.1246 14.7826 46.0743 17.3448 47.6611 19.3822C46.0975 20.5922 44.1421 21.3142 42.0208 21.3142C39.8997 21.3142 37.9438 20.5922 36.3802 19.3822ZM21.3387 19.3822C22.9257 17.3448 23.8754 14.7826 23.8754 12C23.8754 9.21768 22.9257 6.65544 21.3389 4.61784C22.9023 3.408 24.8581 2.68584 26.9792 2.68584C29.1003 2.68584 31.0562 3.408 32.6196 4.61784C31.0328 6.65544 30.083 9.21768 30.083 12C30.083 14.7826 31.0328 17.3448 32.6196 19.3822C31.0562 20.5922 29.1003 21.3142 26.9792 21.3142C24.8581 21.3142 22.9023 20.5922 21.3387 19.3822ZM2.6719 12C2.6719 6.86424 6.82861 2.68584 11.9377 2.68584C14.0588 2.68584 16.0147 3.408 17.578 4.61784C15.9913 6.65544 15.0415 9.21768 15.0415 12C15.0415 14.7826 15.9913 17.3448 17.578 19.3822C16.0147 20.5922 14.0588 21.3142 11.9377 21.3142C6.82861 21.3142 2.6719 17.136 2.6719 12ZM19.4585 17.4305C18.3619 15.9005 17.7134 14.0256 17.7134 12C17.7134 9.97464 18.3619 8.09952 19.4585 6.56952C20.5551 8.09952 21.2035 9.97464 21.2035 12C21.2035 14.0256 20.5551 15.9005 19.4585 17.4305ZM34.5 17.4305C33.4034 15.9005 32.7549 14.0256 32.7549 12C32.7549 9.97464 33.4034 8.09952 34.5 6.56952C35.5966 8.09952 36.2451 9.97464 36.2451 12C36.2451 14.0256 35.5966 15.9005 34.5 17.4305ZM49.5415 17.4305C48.4449 15.9005 47.7965 14.0256 47.7965 12C47.7965 9.97464 48.4449 8.09952 49.5415 6.56952C50.6381 8.09952 51.2866 9.97464 51.2866 12C51.2866 14.0256 50.6381 15.9005 49.5415 17.4305ZM57.0623 0C54.2135 0 51.5958 1.00968 49.5415 2.68968C47.4873 1.00968 44.8696 0 42.0208 0C39.1719 0 36.5542 1.00968 34.5 2.68968C32.4458 1.00968 29.8278 0 26.9792 0C24.1304 0 21.5127 1.00968 19.4585 2.68968C17.4042 1.00968 14.7863 0 11.9377 0C5.35526 0 0 5.3832 0 12C0 18.617 5.35526 24 11.9377 24C14.7863 24 17.4042 22.9906 19.4585 21.3103C21.5127 22.9906 24.1304 24 26.9792 24C29.8278 24 32.4458 22.9906 34.5 21.3103C36.5542 22.9906 39.1719 24 42.0208 24C44.8696 24 47.4873 22.9906 49.5415 21.3103C51.5958 22.9906 54.2135 24 57.0623 24C63.6447 24 69 18.617 69 12C69 5.3832 63.6447 0 57.0623 0Z" fill="#999" />
          </svg>
        </div>
        <p className="text-xs text-gray-400">Wird geladen...</p>
      </div>
    );
  }

  if (!fahrzeug) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-600">
        Kein Fahrzeug gefunden.
      </div>
    );
  }

  const branding = verkaeufer[0]?.branding;
  const beschreibung = parseBeschreibung(fahrzeug.beschreibung);

  const specItems = [
    { icon: Car, label: "Gebrauchtwagen", tooltip: "Fahrzeugart" },
    { icon: Gauge, label: fahrzeug.km_stand ? `${formatKm(fahrzeug.km_stand)} km` : "–", tooltip: "Kilometerstand" },
    { icon: Calendar, label: formatErstzulassung(fahrzeug.erstzulassung), tooltip: "Erstzulassung" },
    { icon: Zap, label: fahrzeug.kw && fahrzeug.ps ? `${fahrzeug.kw} kW / ${fahrzeug.ps} PS` : "–", tooltip: "Leistung" },
    { icon: Fuel, label: fahrzeug.kraftstoff || "–", tooltip: "Kraftstoff" },
    { icon: Settings2, label: fahrzeug.getriebe || "–", tooltip: "Getriebe" },
    { icon: Palette, label: fahrzeug.farbe || "–", tooltip: "Farbe" },
    { icon: Cog, label: fahrzeug.antrieb || "–", tooltip: "Antrieb" },
    { icon: Star, label: fahrzeug.auftragsnummer || "–", tooltip: "Auftragsnummer" },
  ];

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-white">
      {/* Audi Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Links: Logo + Divider + Branding */}
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Nach oben scrollen"
            >
              <svg width="100" height="35" viewBox="0 0 69 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M57.0623 21.3142C54.9409 21.3142 52.9856 20.5922 51.422 19.3822C53.0087 17.3448 53.9585 14.7826 53.9585 12C53.9585 9.21768 53.0087 6.65544 51.422 4.61784C52.9856 3.408 54.9409 2.68584 57.0623 2.68584C62.1714 2.68584 66.3281 6.86424 66.3281 12C66.3281 17.136 62.1714 21.3142 57.0623 21.3142ZM36.3802 19.3822C37.9672 17.3448 38.917 14.7826 38.917 12C38.917 9.21768 37.9672 6.65544 36.3804 4.61784C37.9438 3.408 39.8997 2.68584 42.0208 2.68584C44.1421 2.68584 46.0975 3.408 47.6611 4.61784C46.0743 6.65544 45.1246 9.21768 45.1246 12C45.1246 14.7826 46.0743 17.3448 47.6611 19.3822C46.0975 20.5922 44.1421 21.3142 42.0208 21.3142C39.8997 21.3142 37.9438 20.5922 36.3802 19.3822ZM21.3387 19.3822C22.9257 17.3448 23.8754 14.7826 23.8754 12C23.8754 9.21768 22.9257 6.65544 21.3389 4.61784C22.9023 3.408 24.8581 2.68584 26.9792 2.68584C29.1003 2.68584 31.0562 3.408 32.6196 4.61784C31.0328 6.65544 30.083 9.21768 30.083 12C30.083 14.7826 31.0328 17.3448 32.6196 19.3822C31.0562 20.5922 29.1003 21.3142 26.9792 21.3142C24.8581 21.3142 22.9023 20.5922 21.3387 19.3822ZM2.6719 12C2.6719 6.86424 6.82861 2.68584 11.9377 2.68584C14.0588 2.68584 16.0147 3.408 17.578 4.61784C15.9913 6.65544 15.0415 9.21768 15.0415 12C15.0415 14.7826 15.9913 17.3448 17.578 19.3822C16.0147 20.5922 14.0588 21.3142 11.9377 21.3142C6.82861 21.3142 2.6719 17.136 2.6719 12ZM19.4585 17.4305C18.3619 15.9005 17.7134 14.0256 17.7134 12C17.7134 9.97464 18.3619 8.09952 19.4585 6.56952C20.5551 8.09952 21.2035 9.97464 21.2035 12C21.2035 14.0256 20.5551 15.9005 19.4585 17.4305ZM34.5 17.4305C33.4034 15.9005 32.7549 14.0256 32.7549 12C32.7549 9.97464 33.4034 8.09952 34.5 6.56952C35.5966 8.09952 36.2451 9.97464 36.2451 12C36.2451 14.0256 35.5966 15.9005 34.5 17.4305ZM49.5415 17.4305C48.4449 15.9005 47.7965 14.0256 47.7965 12C47.7965 9.97464 48.4449 8.09952 49.5415 6.56952C50.6381 8.09952 51.2866 9.97464 51.2866 12C51.2866 14.0256 50.6381 15.9005 49.5415 17.4305ZM57.0623 0C54.2135 0 51.5958 1.00968 49.5415 2.68968C47.4873 1.00968 44.8696 0 42.0208 0C39.1719 0 36.5542 1.00968 34.5 2.68968C32.4458 1.00968 29.8278 0 26.9792 0C24.1304 0 21.5127 1.00968 19.4585 2.68968C17.4042 1.00968 14.7863 0 11.9377 0C5.35526 0 0 5.3832 0 12C0 18.617 5.35526 24 11.9377 24C14.7863 24 17.4042 22.9906 19.4585 21.3103C21.5127 22.9906 24.1304 24 26.9792 24C29.8278 24 32.4458 22.9906 34.5 21.3103C36.5542 22.9906 39.1719 24 42.0208 24C44.8696 24 47.4873 22.9906 49.5415 21.3103C51.5958 22.9906 54.2135 24 57.0623 24C63.6447 24 69 18.617 69 12C69 5.3832 63.6447 0 57.0623 0Z" fill="black" />
              </svg>
            </button>
            {branding?.name && (
              <>
                <div className="border-l border-gray-300 h-8 mx-3" />
                <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase text-gray-500">
                  {branding.name}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Rechts: Berater + Telefon (nur Desktop) */}
            {verkaeufer[0] && (
              <div className="hidden md:flex items-center gap-2.5">
                <div className="flex flex-col items-end text-right">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ihr Berater</span>
                  <span className="text-sm font-medium text-gray-900">{verkaeufer[0].vorname} {verkaeufer[0].nachname}</span>
                </div>
                {verkaeufer[0].avatar_url ? (
                  <img src={verkaeufer[0].avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-xs font-bold">
                    {verkaeufer[0].vorname[0]}{verkaeufer[0].nachname[0]}
                  </div>
                )}
              </div>
            )}

            {/* Hamburger Icon (nur Mobile) → Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                  aria-label="Menü öffnen"
                >
                  <Menu size={24} className="text-gray-700" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 bg-white text-gray-900 p-5 rounded-xl shadow-lg border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider text-center mb-3">Ihr Ansprechpartner</p>
                {verkaeufer.length > 0 && verkaeufer.map((v) => (
                  <div key={v.id} className="flex flex-col items-center text-center space-y-2">
                    {v.avatar_url ? (
                      <img src={v.avatar_url} alt={`${v.vorname} ${v.nachname}`} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                        {v.vorname[0]}{v.nachname[0]}
                      </div>
                    )}
                    <p className="font-semibold text-gray-900">{v.vorname} {v.nachname}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Phone size={14} />
                      <span>{v.telefon}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={14} />
                      <span>{v.email}</span>
                    </div>
                    <a
                      href={`tel:${v.telefon}`}
                      className="w-full bg-[#00527a] text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#003d5c] transition-colors mt-1"
                    >
                      <Phone size={15} />
                      Anrufen
                    </a>
                  </div>
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Fahrzeug Titel */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 animate-fade-in">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {fahrzeug.fahrzeugname}
        </h1>
        <p className="text-gray-500 mt-1">
          ab {formatPrice(fahrzeug.preis)} EUR
        </p>
      </div>

      {/* Hero Section 60/40 */}
      <div className="max-w-7xl mx-auto px-4 pb-8 opacity-0 animate-fade-in" style={{ animationDelay: "150ms" }}>
        <div className="flex flex-col lg:flex-row gap-0 rounded-lg overflow-hidden">
          {/* Main Image */}
          <div className="lg:w-[60%] order-1">
            <div className="bg-gray-100">
              {mainImage ? (
              <div className="relative">
                <img
                  src={mainImage}
                  alt={fahrzeug.fahrzeugname}
                  className="w-full h-full object-cover min-h-[250px] lg:min-h-[500px]"
                />
                <div className="absolute inset-0 z-10" />
              </div>
              ) : (
                <div className="w-full h-full min-h-[250px] lg:min-h-[500px] flex items-center justify-center text-gray-400">
                  Kein Bild vorhanden
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails - between image and info on mobile */}
          {fahrzeug.bilder && fahrzeug.bilder.length > 1 && (
            <div className="order-2 lg:hidden">
              <ThumbnailGallery
                bilder={fahrzeug.bilder}
                fahrzeugname={fahrzeug.fahrzeugname}
                mainImage={mainImage}
                onSelect={setMainImage}
              />
            </div>
          )}

          {/* Info Box 40% */}
          <div className="lg:w-[40%] bg-[#323232] text-white p-6 flex flex-col order-3 lg:order-2">
            <h2 className="text-xl font-semibold mb-6">{fahrzeug.fahrzeugname}</h2>

            {/* 3x3 Spec Grid */}
            <div className="grid grid-cols-3 border border-[#3a3a3a] flex-1">
              {specItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div
                        className="flex flex-col items-center justify-center p-3 text-center border border-[#3a3a3a] bg-[#3c3c3c] gap-2 cursor-default"
                      >
                        <Icon size={28} className="text-white/70" />
                        <span className="text-xs leading-tight">{item.label}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#00527a] text-white border-[#00527a]">{item.tooltip}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Price Banner */}
            <div className="bg-[#00527a] mt-6 rounded-sm p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Preis</p>
                <p className="text-xs text-white/70">inkl. MwSt.</p>
              </div>
              <p className="text-2xl font-bold">{formatPrice(fahrzeug.preis)} €</p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => setAnfrageOpen(true)}
              className="mt-4 w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
            >
              <Mail size={18} />
              Fahrzeug anfragen
            </button>
          </div>
        </div>

        {/* Thumbnails - below entire hero section on desktop, no gap */}
        {fahrzeug.bilder && fahrzeug.bilder.length > 1 && (
          <div className="hidden lg:block">
            <ThumbnailGallery
              bilder={fahrzeug.bilder}
              fahrzeugname={fahrzeug.fahrzeugname}
              mainImage={mainImage}
              onSelect={setMainImage}
            />
          </div>
        )}
      </div>

      {/* Details Section 60/40 */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Description 60% */}
          <div className="lg:w-[60%]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Beschreibung</h2>
            {beschreibung.length > 0 ? (
              <div className="space-y-6">
                {beschreibung.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      {section.title}
                    </h3>
                    <ul className="space-y-1.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-gray-600">
                          <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Keine Beschreibung vorhanden.</p>
            )}
          </div>

          {/* Seller / Location 40% */}
          <div className="lg:w-[40%] lg:sticky lg:top-20 lg:self-start space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ihr Ansprechpartner</h2>
              {verkaeufer.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {verkaeufer.map((v) => (
                    <div key={v.id} className="flex items-center gap-4 mb-3">
                      {v.avatar_url ? (
                        <img src={v.avatar_url} alt={`${v.vorname} ${v.nachname}`} className="w-14 h-14 rounded-full object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold">
                          {v.vorname[0]}{v.nachname[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{v.vorname} {v.nachname}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Phone size={14} />
                          <span>{v.telefon}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                          <Mail size={14} />
                          <span>{v.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <a
                    href={`tel:${verkaeufer[0]?.telefon || ""}`}
                    className="w-full bg-[#00527a] text-white text-sm font-medium py-2.5 px-4 rounded flex items-center justify-center gap-2 hover:bg-[#003d5c] transition-colors"
                  >
                    <Phone size={14} />
                    Anrufen
                  </a>
                </div>
              ) : (
                <p className="text-gray-500">Kein Ansprechpartner vorhanden.</p>
              )}
            </div>

            {/* Unsere Leistungen */}
            <div className="bg-[#00527a] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Unsere Leistungen</h3>
              <ul className="space-y-2">
                {[
                  "3 Jahre Audi Gebrauchtwagengarantie",
                  "inklusive Kostenfreie Lieferung in Deutschland",
                  "Attraktive Konditionen auch für Gewerbekunden",
                  "Direkte Vermittlung im Kundenauftrag (ohne Zwischenhandel)",
                  "Persönlicher Ansprechpartner von Auswahl bis Auslieferung",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/90">
                    <Check size={16} className="text-white mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ihre Vorteile */}
            <div className="bg-[#00527a] rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Ihre Vorteile</h3>
              <ul className="space-y-2">
                {[
                  "Direkter Zugang zu exklusiven Kundenfahrzeugen",
                  "Attraktive Preisvorteile gegenüber dem klassischen Handel",
                  "Individuelle Beratung abgestimmt auf Ihre Wünsche",
                  "Schnelle und flexible Fahrzeugübergabe",
                  "Kauf ohne versteckte Zusatzkosten",
                  "Sicherheit durch Vermittlung geprüfter Fahrzeuge",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/90">
                    <Check size={16} className="text-white mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Energieverbrauch & CO₂-Emissionen */}
      <div className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-lg font-semibold text-gray-500 mb-6">
            Information über den Energieverbrauch* und die CO₂-Emissionen**
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm text-gray-500">
            {/* Spalte 1: CO₂ Emissionen */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">CO₂ Emissionen**</h3>
              <div className="space-y-[2px] mb-4 max-w-[140px]">
                {[
                  { letter: "A", color: "#00a651", width: "55%" },
                  { letter: "B", color: "#51b747", width: "65%" },
                  { letter: "C", color: "#bdd62e", width: "72%" },
                  { letter: "D", color: "#fff200", width: "78%" },
                  { letter: "E", color: "#f7941d", width: "85%" },
                  { letter: "F", color: "#f15a24", width: "92%" },
                  { letter: "G", color: "#ed1c24", width: "100%" },
                ].map((bar) => (
                  <div
                    key={bar.letter}
                    className="h-5 flex items-center px-2 text-white text-xs font-bold"
                    style={{
                      backgroundColor: bar.color,
                      width: bar.width,
                      clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)",
                    }}
                  >
                    {bar.letter}
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">
                Es wurden keine Angaben zu CO₂ Emissionen hinterlegt.
              </p>
            </div>

            {/* Spalte 2: Verbrauch & Reichweite */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Verbrauch &amp; Reichweite*</h3>
              <p>
                <span className="text-gray-400">Energieträger:</span>{" "}
                {fahrzeug.kraftstoff || "–"}
              </p>
            </div>

            {/* Spalte 3: Energiekosten */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Energiekosten***</h3>
              <p className="text-gray-400 text-xs">
                Es wurden keine Angaben zu Kosten hinterlegt.
              </p>
            </div>

            {/* Spalte 4: leer */}
            <div />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
          <p className="text-xs text-gray-500 font-medium">© 2026 AUDI AG. Alle Rechte vorbehalten</p>

          <p className="text-xs text-gray-400">
            <Link to="/rechtliches/impressum" className="hover:text-gray-600 transition-colors">Impressum</Link> · <Link to="/rechtliches" className="hover:text-gray-600 transition-colors">Rechtliches</Link> · <Link to="/rechtliches/datenschutzinformation" className="hover:text-gray-600 transition-colors">Datenschutzinformation</Link> · <Link to="/rechtliches/cookie-richtlinie" className="hover:text-gray-600 transition-colors">Cookie-Richtlinie</Link> · <Link to="/rechtliches/barrierefreiheit" className="hover:text-gray-600 transition-colors">Barrierefreiheit</Link> · <Link to="/rechtliches/digital-services-act" className="hover:text-gray-600 transition-colors">Digital Services Act</Link> · <Link to="/rechtliches/eu-data-act" className="hover:text-gray-600 transition-colors">EU Data Act</Link>
          </p>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            Hinweis: Die aktuelle Darstellung und Anordnung der Embleme am Fahrzeug bei allen Abbildungen auf dieser Webseite kann abweichen.
          </p>

          <div className="space-y-4 text-[11px] text-gray-400 leading-relaxed">
            <p>
              <sup>1</sup> Die Angaben zu Kraftstoffverbrauch, Stromverbrauch, CO₂-Emissionen und elektrischer Reichweite wurden nach dem gesetzlich vorgeschriebenen Messverfahren „Worldwide Harmonized Light Vehicles Test Procedure" (WLTP) gemäß Verordnung (EG) 715/2007 ermittelt. Zusatzausstattungen und Zubehör (Anbauteile, Reifenformat usw.) können relevante Fahrzeugparameter, wie z.&nbsp;B. Gewicht, Rollwiderstand und Aerodynamik verändern und neben Witterungs- und Verkehrsbedingungen sowie dem individuellen Fahrverhalten den Kraftstoffverbrauch, den Stromverbrauch, die CO₂-Emissionen, die elektrische Reichweite und die Fahrleistungswerte eines Fahrzeugs beeinflussen. Weitere Informationen zu WLTP finden Sie unter www.audi.de/wltp.
            </p>
            <p>
              <sup>2</sup> Gilt nur bei Bezahlung mit EC-Karte bzw. allen gängigen Kreditkarten (außer American Express). Nach 45 Minuten fällt zudem eine Standgebühr in Höhe von 0,10&nbsp;€ / Minute an.
            </p>
            <p>
              <sup>3</sup> Nur für Privatkunden. Die E‑Auto-Förderung gilt beim Kauf oder Leasing eines erstmals in Deutschland zugelassenen Neufahrzeugs der EU-Fahrzeugklasse M1 mit rein batterieelektrischem Antrieb, batterieelektrischem Antrieb mit Range-Extender oder Plug-in-Hybrid-Antrieb. Fahrzeuge mit Range-Extender oder Plug-in-Hybrid-Antrieb werden gefördert, sofern die Fahrzeuge bestimmte klimaschutzrelevante Anforderungen erfüllen. Weitere Informationen finden Sie auf der Seite des Bundesumweltministeriums.
            </p>
          </div>
        </div>
      </footer>
    </div>

    {/* Anfrage Dialog */}
    <Dialog open={anfrageOpen} onOpenChange={(open) => { setAnfrageOpen(open); if (!open) resetAnfrageForm(); }}>
      <DialogContent className="max-w-3xl w-full sm:rounded-xl max-h-[90vh] overflow-y-auto md:max-h-none md:overflow-visible max-sm:h-full max-sm:max-h-full max-sm:rounded-none max-sm:border-0 max-sm:data-[state=open]:!animate-none max-sm:data-[state=closed]:!animate-none [&>button]:top-5 [&>button]:right-5">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Schreiben Sie uns</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAnfrageSubmit} className="space-y-5 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Vorname <span className="text-red-500">*</span></label>
              <Input
                required
                value={anfrageForm.vorname}
                onChange={(e) => setAnfrageForm(f => ({ ...f, vorname: e.target.value }))}
                maxLength={100}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nachname <span className="text-red-500">*</span></label>
              <Input
                required
                value={anfrageForm.nachname}
                onChange={(e) => setAnfrageForm(f => ({ ...f, nachname: e.target.value }))}
                maxLength={100}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail <span className="text-red-500">*</span></label>
              <Input
                type="email"
                required
                value={anfrageForm.email}
                onChange={(e) => setAnfrageForm(f => ({ ...f, email: e.target.value }))}
                maxLength={255}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rückrufnummer <span className="text-red-500">*</span></label>
              <Input
                type="tel"
                required
                value={anfrageForm.telefon}
                onChange={(e) => setAnfrageForm(f => ({ ...f, telefon: e.target.value }))}
                maxLength={30}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ihre Nachricht <span className="text-red-500">*</span></label>
            <Textarea
              required
              value={anfrageForm.nachricht}
              onChange={(e) => setAnfrageForm(f => ({ ...f, nachricht: e.target.value }))}
              className="min-h-[140px] bg-white border-gray-300 text-gray-900"
              maxLength={2000}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="datenschutz"
              checked={datenschutz}
              onCheckedChange={(v) => setDatenschutz(v === true)}
              className="mt-0.5 h-5 w-5 rounded border-gray-300 bg-white data-[state=checked]:bg-[#00527a] data-[state=checked]:border-[#00527a] data-[state=checked]:text-white"
            />
            <label htmlFor="datenschutz" className="text-sm text-gray-600 leading-relaxed cursor-pointer" onClick={() => setDatenschutz(!datenschutz)}>
              Ich bin damit einverstanden, dass die übermittelten Daten entsprechend der{" "}
              <Link to="/rechtliches/datenschutzinformation" className="text-[#00527a] underline hover:text-[#003d5c]" target="_blank" onClick={(e) => e.stopPropagation()}>
                Datenschutzbestimmungen
              </Link>{" "}
              gespeichert und verarbeitet werden dürfen. Zudem gebe ich meine Zustimmung über die angegebenen Möglichkeiten kontaktiert zu werden. <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400"><span className="text-red-500">*</span> benötigte Angaben</p>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={resetAnfrageForm}>
                Zurücksetzen
              </Button>
              <Button
                type="submit"
                disabled={submitting || !datenschutz}
                className="bg-[#00527a] hover:bg-[#003d5c] text-white"
              >
                {submitting ? "Senden..." : "Abschicken"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    </TooltipProvider>
  );
}
