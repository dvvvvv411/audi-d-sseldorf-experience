import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { Car, Gauge, Calendar, Zap, Fuel, Settings2, ImagePlus, Menu, Phone, Mail } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type Fahrzeug = Tables<"fahrzeuge">;
type Verkaeufer = Tables<"verkaeufer">;
type Branding = Tables<"brandings">;
type VerkaeuferFahrzeuge = Tables<"verkaeufer_fahrzeuge">;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0 }).format(price);

const formatKm = (km: number) =>
  new Intl.NumberFormat("de-DE").format(km);

const formatErstzulassung = (ez: string | null) => {
  if (!ez) return "–";
  const dotMatch = ez.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) return `${dotMatch[2].padStart(2, "0")}/${dotMatch[3]}`;
  const d = new Date(ez);
  if (!isNaN(d.getTime())) return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  return ez;
};

const AudiLogo = ({ fill = "black", width = 100, height = 35 }: { fill?: string; width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox="0 0 69 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M57.0623 21.3142C54.9409 21.3142 52.9856 20.5922 51.422 19.3822C53.0087 17.3448 53.9585 14.7826 53.9585 12C53.9585 9.21768 53.0087 6.65544 51.422 4.61784C52.9856 3.408 54.9409 2.68584 57.0623 2.68584C62.1714 2.68584 66.3281 6.86424 66.3281 12C66.3281 17.136 62.1714 21.3142 57.0623 21.3142ZM36.3802 19.3822C37.9672 17.3448 38.917 14.7826 38.917 12C38.917 9.21768 37.9672 6.65544 36.3804 4.61784C37.9438 3.408 39.8997 2.68584 42.0208 2.68584C44.1421 2.68584 46.0975 3.408 47.6611 4.61784C46.0743 6.65544 45.1246 9.21768 45.1246 12C45.1246 14.7826 46.0743 17.3448 47.6611 19.3822C46.0975 20.5922 44.1421 21.3142 42.0208 21.3142C39.8997 21.3142 37.9438 20.5922 36.3802 19.3822ZM21.3387 19.3822C22.9257 17.3448 23.8754 14.7826 23.8754 12C23.8754 9.21768 22.9257 6.65544 21.3389 4.61784C22.9023 3.408 24.8581 2.68584 26.9792 2.68584C29.1003 2.68584 31.0562 3.408 32.6196 4.61784C31.0328 6.65544 30.083 9.21768 30.083 12C30.083 14.7826 31.0328 17.3448 32.6196 19.3822C31.0562 20.5922 29.1003 21.3142 26.9792 21.3142C24.8581 21.3142 22.9023 20.5922 21.3387 19.3822ZM2.6719 12C2.6719 6.86424 6.82861 2.68584 11.9377 2.68584C14.0588 2.68584 16.0147 3.408 17.578 4.61784C15.9913 6.65544 15.0415 9.21768 15.0415 12C15.0415 14.7826 15.9913 17.3448 17.578 19.3822C16.0147 20.5922 14.0588 21.3142 11.9377 21.3142C6.82861 21.3142 2.6719 17.136 2.6719 12ZM19.4585 17.4305C18.3619 15.9005 17.7134 14.0256 17.7134 12C17.7134 9.97464 18.3619 8.09952 19.4585 6.56952C20.5551 8.09952 21.2035 9.97464 21.2035 12C21.2035 14.0256 20.5551 15.9005 19.4585 17.4305ZM34.5 17.4305C33.4034 15.9005 32.7549 14.0256 32.7549 12C32.7549 9.97464 33.4034 8.09952 34.5 6.56952C35.5966 8.09952 36.2451 9.97464 36.2451 12C36.2451 14.0256 35.5966 15.9005 34.5 17.4305ZM49.5415 17.4305C48.4449 15.9005 47.7965 14.0256 47.7965 12C47.7965 9.97464 48.4449 8.09952 49.5415 6.56952C50.6381 8.09952 51.2866 9.97464 51.2866 12C51.2866 14.0256 50.6381 15.9005 49.5415 17.4305ZM57.0623 0C54.2135 0 51.5958 1.00968 49.5415 2.68968C47.4873 1.00968 44.8696 0 42.0208 0C39.1719 0 36.5542 1.00968 34.5 2.68968C32.4458 1.00968 29.8278 0 26.9792 0C24.1304 0 21.5127 1.00968 19.4585 2.68968C17.4042 1.00968 14.7863 0 11.9377 0C5.35526 0 0 5.3832 0 12C0 18.617 5.35526 24 11.9377 24C14.7863 24 17.4042 22.9906 19.4585 21.3103C21.5127 22.9906 24.1304 24 26.9792 24C29.8278 24 32.4458 22.9906 34.5 21.3103C36.5542 22.9906 39.1719 24 42.0208 24C44.8696 24 47.4873 22.9906 49.5415 21.3103C51.5958 22.9906 54.2135 24 57.0623 24C63.6447 24 69 18.617 69 12C69 5.3832 63.6447 0 57.0623 0Z" fill={fill} />
  </svg>
);

function FahrzeugCard({ fahrzeug, sellerSlug }: { fahrzeug: Fahrzeug; sellerSlug: string }) {
  const specs = [
    { icon: Car, label: "Gebrauchtwagen" },
    { icon: Gauge, label: fahrzeug.km_stand ? `${formatKm(fahrzeug.km_stand)} km` : "–" },
    { icon: Calendar, label: formatErstzulassung(fahrzeug.erstzulassung) },
    { icon: Zap, label: fahrzeug.kw && fahrzeug.ps ? `${fahrzeug.kw} kW / ${fahrzeug.ps} PS` : "–" },
    { icon: Fuel, label: fahrzeug.kraftstoff || "–" },
    { icon: Settings2, label: fahrzeug.getriebe || "–" },
  ];

  return (
    <Link to={`/gebrauchtwagen/${sellerSlug}/${fahrzeug.auftragsnummer || fahrzeug.id}`} className="group bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow block">
      {/* Image */}
      <div className="relative aspect-[16/10] bg-gray-100">
        {fahrzeug.bilder && fahrzeug.bilder.length > 0 ? (
          <>
            <img src={fahrzeug.bilder[0]} alt={fahrzeug.fahrzeugname} className="w-full h-full object-cover" />
            <div className="absolute inset-0 z-10" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlus className="w-12 h-12 text-gray-300" />
          </div>
        )}
        {/* Branding bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-3 py-1.5 flex items-center gap-2">
          <AudiLogo fill="white" width={48} height={17} />
          <span className="text-white text-[10px] tracking-wider uppercase">Gebrauchtwagen</span>
        </div>
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-3">
        <h3 className="font-bold text-gray-900 text-base leading-tight">{fahrzeug.fahrzeugname}</h3>
      </div>

      {/* Specs Grid */}
      <div className="bg-[#fbfbfb] py-1">
        <div className="grid grid-cols-3 grid-rows-2">
          {specs.map((spec, i) => (
            <div key={i} className="flex flex-col items-center justify-center gap-1 py-3.5 px-2">
              <spec.icon className="w-6 h-6 text-gray-700" />
              <span className="text-[11px] font-medium text-gray-700 text-center leading-tight">{spec.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Price Footer */}
      <div
        className="bg-[#323232] group-hover:bg-[#00527a] transition-colors px-4 py-4 flex items-center justify-between"
      >
        <div>
          <p className="text-white text-xs">Preis</p>
          <p className="text-white/70 text-xs">inkl. MwSt.</p>
        </div>
        <p className="text-white font-bold text-xl">{formatPrice(fahrzeug.preis)} €</p>
      </div>
    </Link>
  );
}

export default function Fahrzeugbestand() {
  usePageMeta("Fahrzeugbestand · Audi Düsseldorf", "Unser aktueller Fahrzeugbestand – finden Sie Ihren Audi bei Audi Düsseldorf. Große Auswahl an Neu- und Gebrauchtwagen.");
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [branding, setBranding] = useState<Branding | null>(null);
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [vfMap, setVfMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: fzData }, { data: brData }, { data: vkData }, { data: vfData }] = await Promise.all([
        supabase.from("fahrzeuge").select("*").order("created_at", { ascending: false }),
        supabase.from("brandings").select("*").limit(1).single(),
        supabase.from("verkaeufer").select("*").limit(1),
        supabase.from("verkaeufer_fahrzeuge").select("*"),
      ]);
      setFahrzeuge(fzData || []);
      setBranding(brData);
      setVerkaeufer(vkData || []);

      // Build fahrzeug_id → sellerSlug map
      const allVerkaeufer = vkData || [];
      const map: Record<string, string> = {};
      if (vfData && allVerkaeufer.length > 0) {
        // We only have first seller loaded; fetch all sellers for slug building
        const sellerIds = [...new Set(vfData.map(vf => vf.verkaeufer_id))];
        const { data: allSellers } = await supabase.from("verkaeufer").select("id, vorname, nachname").in("id", sellerIds);
        const sellerMap = new Map((allSellers || []).map(s => [s.id, `${s.vorname}_${s.nachname}`.toLowerCase()]));
        vfData.forEach(vf => {
          const slug = sellerMap.get(vf.verkaeufer_id);
          if (slug) map[vf.fahrzeug_id] = slug;
        });
      }
      setVfMap(map);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <div className="animate-pulse opacity-40">
          <AudiLogo fill="#999" width={80} height={28} />
        </div>
        <p className="text-xs text-gray-400">Wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header — identical to Gebrauchtwagen */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="Nach oben scrollen"
            >
              <AudiLogo />
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

      {/* Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 animate-fade-in">Fahrzeugbestand</h1>

        {fahrzeuge.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">Aktuell keine Fahrzeuge im Bestand</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fahrzeuge.map((f, index) => (
              <div key={f.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${index * 80}ms` }}>
                <FahrzeugCard fahrzeug={f} sellerSlug={vfMap[f.id] || "markus_heber"} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer — identical to Gebrauchtwagen */}
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
              <sup>1</sup> Die Angaben zu Kraftstoffverbrauch, Stromverbrauch, CO₂-Emissionen und elektrischer Reichweite wurden nach dem gesetzlich vorgeschriebenen Messverfahren „Worldwide Harmonized Light Vehicles Test Procedure" (WLTP) gemäß Verordnung (EG) 715/2007 ermittelt.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
