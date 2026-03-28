import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  Car, Gauge, Calendar, Zap, Fuel, Settings2,
  Palette, Cog, Hash, Mail, Phone, MapPin, Check
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
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

export default function Gebrauchtwagen() {
  const [fahrzeug, setFahrzeug] = useState<Fahrzeug | null>(null);
  const [verkaeufer, setVerkaeufer] = useState<VerkaeuferMitBranding[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      // Load first vehicle
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

        // Load assigned sellers
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
            // Load brandings for each seller
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
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
    { icon: Hash, label: fahrzeug.auftragsnummer || "–", tooltip: "Auftragsnummer" },
  ];

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {fahrzeug.fahrzeugname}
        </h1>
        <p className="text-gray-500 mt-1">
          ab {formatPrice(fahrzeug.preis)} EUR
        </p>
      </div>

      {/* Hero Section 60/40 */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="flex flex-col lg:flex-row gap-0 rounded-lg overflow-hidden">
          {/* Main Image 60% */}
          <div className="lg:w-[60%] bg-gray-100">
            {mainImage ? (
              <img
                src={mainImage}
                alt={fahrzeug.fahrzeugname}
                className="w-full h-full object-cover min-h-[300px] lg:min-h-[500px]"
              />
            ) : (
              <div className="w-full h-full min-h-[300px] lg:min-h-[500px] flex items-center justify-center text-gray-400">
                Kein Bild vorhanden
              </div>
            )}
          </div>

          {/* Info Box 40% */}
          <div className="lg:w-[40%] bg-[#323232] text-white p-6 flex flex-col">
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
                    <TooltipContent>{item.tooltip}</TooltipContent>
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
            <button className="mt-4 w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
              <Mail size={18} />
              Fahrzeug anfragen
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {fahrzeug.bilder && fahrzeug.bilder.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-petrol">
            {fahrzeug.bilder.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                  mainImage === img ? "border-[#00527a]" : "border-transparent"
                }`}
              >
                <img
                  src={img}
                  alt={`${fahrzeug.fahrzeugname} Bild ${i + 1}`}
                  className="h-28 w-48 object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

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
          <div className="lg:w-[40%]">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Standort</h2>
            {branding ? (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="font-bold text-gray-900 text-lg">{branding.name}</p>
                <div className="space-y-2 text-gray-600 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{branding.strasse}</p>
                      <p>{branding.plz} {branding.stadt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="flex-shrink-0" />
                    <p>{branding.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="flex-shrink-0" />
                    <p>{branding.email}</p>
                  </div>
                </div>

                {verkaeufer.length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Ihr Ansprechpartner</p>
                    {verkaeufer.map((v) => (
                      <div key={v.id} className="flex items-center gap-3 mb-3">
                        {v.avatar_url ? (
                          <img src={v.avatar_url} alt={`${v.vorname} ${v.nachname}`} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                            {v.vorname[0]}{v.nachname[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{v.vorname} {v.nachname}</p>
                          <p className="text-xs text-gray-500">{v.telefon}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <a
                    href={`tel:${verkaeufer[0]?.telefon || ""}`}
                    className="flex-1 bg-[#00527a] text-white text-sm font-medium py-2.5 px-4 rounded flex items-center justify-center gap-2 hover:bg-[#003d5c] transition-colors"
                  >
                    <Phone size={14} />
                    Anrufen
                  </a>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${branding.strasse}, ${branding.plz} ${branding.stadt}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-2.5 px-4 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <MapPin size={14} />
                    Route berechnen
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Keine Standortinformationen vorhanden.</p>
            )}
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}
