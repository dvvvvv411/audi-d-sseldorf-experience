import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useActiveBranding } from "@/hooks/useActiveBranding";
import { useDynamicLegalReplacements } from "@/hooks/useDynamicLegalReplacements";

export default function Barrierefreiheit() {
  const { branding } = useActiveBranding();
  const company = (branding as any)?.footer_unternehmensname || branding?.name || "";
  usePageMeta(company ? `Barrierefreiheit · ${company}` : "Barrierefreiheit", "Erklärung zur Barrierefreiheit.");
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  useDynamicLegalReplacements(contentRef);
  const logoUrl = (branding as any)?.logo_pdf_url as string | undefined;

  return (
    <div className="min-h-screen bg-white" ref={contentRef}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/gebrauchtwagen" className="inline-block mb-4 hover:opacity-80 transition-opacity">
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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Informationen zur Barrierefreiheit</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Unser Dienst einfach erklärt</h2>
            <p className="mb-3">Wir bieten über unsere Webseite die Möglichkeit an,</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Informationen über unsere aktuellen Fahrzeuge, Produkte, Dienstleistungen und Veranstaltungen zu erhalten (z. B. in Form von Bildern, Videos und Informationstexten),</li>
              <li>im Rahmen verschiedener Kontaktformulare Anfragen zu Themen wie Serviceterminen, Probefahrten oder Produktberatung an uns zu senden. Wählen Sie hierzu das passende Formular bzw. Thema und geben Sie die relevanten Daten vor dem Absenden ein,</li>
              <li>in unserer Gebrauchtwagenbörse anhand definierter Suchkriterien und Filter Ihr Wunschfahrzeug zu finden. Eine Bestellung von Fahrzeugen direkt über die Webseite ist nicht möglich. Wir informieren Sie jedoch, wie Sie Kontakt zu unseren Verkaufsberatenden für einen Kauf aufnehmen können.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">So können Sie unseren Dienst barrierefrei nutzen</h2>
            <p className="mb-4">Nach dem Barrierefreiheitsstärkungsgesetz müssen wir unsere Dienste, die sogenannte Dienstleistungen im elektronischen Geschäftsverkehr darstellen, barrierefrei gestalten. Das bedeutet, dass insbesondere entsprechende Inhalte wie Texte, Bilder und Funktionen auf unserer Webseite wahrnehmbar, bedienbar, verständlich und robust gestaltet werden müssen. Unser Dienst bietet Ihnen dafür unter anderem die folgenden Funktionen:</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">a) Wahrnehmbar</h3>
            <p>Damit Sie Inhalte auf unserem Dienst besser wahrnehmen können, haben z. B. alle Bilder eine alternative Text-Beschreibung, außer wenn Bilder rein „dekorativ" sind, das heißt, ihr Inhalt ist beispielsweise schon im Text angegeben.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">b) Bedienbar</h3>
            <p>Unser Dienst ist auch erleichtert bedienbar, so kann die Webseite z. B. per Tastatur bedient werden.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">c) Verständlich</h3>
            <p>Damit unser Dienst verständlich ist, können z. B. assistive Technologien die Sprache der Webseite erkennen.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">d) Robust</h3>
            <p>Zuletzt ist unsere Webseite auch robust, das heißt, die Kompatibilität mit verschiedenen assistiven Technologien ist sichergestellt.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Marktüberwachungsbehörde</h2>
            <p>Die zuständige Marktüberwachungsbehörde für Fragen der Einhaltung der Barrierefreiheitsanforderungen ist die Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen mit Sitz in Sachsen-Anhalt.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Kontakt</h2>
            <p>Sie haben Fragen oder Anregungen zur barrierefreien Gestaltung unserer Angebote? Wir sind jederzeit für Sie erreichbar. Kontaktieren Sie uns gerne über {branding?.email || "unsere im Impressum hinterlegte E-Mail-Adresse"}.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
