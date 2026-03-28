import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  Car, Gauge, Calendar, Zap, Fuel, Settings2,
  Palette, Cog, Star, Mail, Phone, Check
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
              <svg width="100" height="34" viewBox="0 0 188 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
                <circle cx="80" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
                <circle cx="120" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
                <circle cx="160" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
              </svg>
            </button>
            {branding?.name && (
              <>
                <div className="border-l border-gray-300 h-8 ml-1.5 mr-2" />
                <span className="text-[10px] md:text-xs font-semibold tracking-[0.15em] uppercase text-gray-500">
                  {branding.name}
                </span>
              </>
            )}
          </div>

          {/* Rechts: Berater + Telefon (zweizeilig, nur Desktop) */}
          {verkaeufer[0] && (
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Ihr Berater</span>
              <span className="text-sm font-medium text-gray-900">{verkaeufer[0].vorname} {verkaeufer[0].nachname}</span>
            </div>
          )}
        </div>
      </header>

      {/* Fahrzeug Titel */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {fahrzeug.fahrzeugname}
        </h1>
        <p className="text-gray-500 mt-1">
          ab {formatPrice(fahrzeug.preis)} EUR
        </p>
      </div>

      {/* Hero Section 60/40 */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="flex flex-col lg:flex-row gap-0 rounded-lg overflow-hidden">
          {/* Main Image */}
          <div className="lg:w-[60%] order-1">
            <div className="bg-gray-100">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={fahrzeug.fahrzeugname}
                  className="w-full h-full object-cover min-h-[250px] lg:min-h-[500px]"
                />
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
            <button className="mt-4 w-full bg-white text-gray-700 font-semibold py-3 px-6 rounded-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
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
          <div className="lg:w-[40%] lg:sticky lg:top-4 lg:self-start">
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
            Impressum · Rechtliches · Hinweisgebersystem · Datenschutzinformation · Cookie-Einstellungen · Cookie-Richtlinie · Barrierefreiheit · Digital Services Act · EU Data Act
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
    </TooltipProvider>
  );
}
