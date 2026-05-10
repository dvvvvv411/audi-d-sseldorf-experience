import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useActiveBranding, getVorstandList } from "@/hooks/useActiveBranding";

export default function Impressum() {
  const { branding } = useActiveBranding();
  const company = (branding as any)?.footer_unternehmensname || branding?.name || "";
  usePageMeta(company ? `Impressum · ${company}` : "Impressum", `Impressum und Kontaktdaten${company ? ` von ${company}` : ""}.`);
  const navigate = useNavigate();

  const vorstand = getVorstandList(branding as any);
  const logoUrl = (branding as any)?.logo_pdf_url as string | undefined;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/gebrauchtwagen" className="inline-block mb-4 hover:opacity-70 transition-opacity">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-7 w-auto" />
          ) : (
            <svg width="80" height="28" viewBox="0 0 188 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
              <circle cx="80" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
              <circle cx="120" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
              <circle cx="160" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            </svg>
          )}
        </Link>

        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Impressum</h1>

        {!branding ? (
          <p className="text-sm text-gray-400">Lädt …</p>
        ) : (
          <div className="text-sm text-gray-700 leading-relaxed space-y-4">
            <p className="font-semibold text-base">{company}</p>

            <div>
              <p>{branding.strasse}</p>
              <p>{branding.plz} {branding.stadt}</p>
              <p>Deutschland</p>
            </div>

            <p><span className="font-semibold">E-Mail:</span> {branding.email}</p>

            <div>
              <p className="font-semibold mb-2">Vorstand:</p>
              <ul className="list-none space-y-1">
                <li>{branding.geschaeftsfuehrer} (Vorsitzender)</li>
                {vorstand.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <p>
              {company} ist im Handelsregister des {branding.amtsgericht} unter der Nummer {branding.handelsregister} eingetragen.
            </p>

            <p>Die Umsatzsteueridentifikationsnummer von {company} ist {branding.ust_id}.</p>

            <p>{company} ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder bereit noch dazu verpflichtet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
