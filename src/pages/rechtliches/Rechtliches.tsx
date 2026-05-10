import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useActiveBranding } from "@/hooks/useActiveBranding";
import { useDynamicLegalReplacements } from "@/hooks/useDynamicLegalReplacements";

export default function Rechtliches() {
  const { branding } = useActiveBranding();
  const company = (branding as any)?.footer_unternehmensname || branding?.name || "";
  usePageMeta(company ? `Rechtliches · ${company}` : "Rechtliches", "Rechtliche Informationen.");
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  useDynamicLegalReplacements(contentRef);
  const logoUrl = (branding as any)?.logo_pdf_url as string | undefined;

  return (
    <div className="min-h-screen bg-white" ref={contentRef}>
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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Haftungsausschluss</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          <p>
            Die AUDI AG stellt die Inhalte dieser Internetseiten mit großer Sorgfalt zusammen und sorgt für deren regelmäßige Aktualisierung. Die Angaben dienen dennoch nur der unverbindlichen allgemeinen Information und ersetzen nicht die eingehende individuelle Beratung für eine Kaufentscheidung. Die technischen Merkmale und Ausstattungen der beschriebenen Fahrzeuge sind lediglich Beispiele. Solche Merkmale und Ausstattungen können insbesondere landesspezifisch variieren. Jederzeitige Änderungen bleiben vorbehalten. Verbindliche Angaben zu den technischen Merkmalen, Ausstattungen oder Eigenschaften unserer Fahrzeuge erhalten Sie ausschließlich jeweils aktuell von Ihrem Vertragshändler oder Importeur.
          </p>

          <p>
            Die AUDI AG übernimmt keine Gewähr für die Aktualität, Richtigkeit und Vollständigkeit der Informationen auf diesen Seiten oder den jederzeitigen störungsfreien Zugang. Wenn wir auf Internetseiten Dritter verweisen (Links), übernimmt die AUDI AG keine Verantwortung für die Inhalte der verlinkten Seiten. Mit dem Betätigen des Verweises verlassen Sie das Informationsangebot der AUDI AG. Für die Angebote Dritter können daher abweichende Regelungen gelten, insbesondere hinsichtlich des Datenschutzes. Weiterhin schließt die AUDI AG ihre Haftung bei Serviceleistungen, insbesondere beim Download von durch die AUDI AG zur Verfügung gestellten Dateien auf den Internetseiten der AUDI AG, für leicht fahrlässige Pflichtverletzungen aus, sofern diese keine vertragswesentlichen Pflichten sowie Leben, Gesundheit oder Körper betreffen oder Ansprüche nach dem Produkthaftungsgesetz berührt sind. Gleiches gilt für Pflichtverletzungen unserer Erfüllungsgehilfen.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Zusätzlicher Hinweis zu den Karriere Seiten</h2>

          <p>
            Lediglich zur Vereinfachung der Lesbarkeit finden sich in den Texten der Audi Karriere Seiten ausschließlich die männlichen Bezeichnungen der von uns angebotenen Maßnahmen. Selbstverständlich ist ihre Ausrichtung in jedem Fall geschlechtsunabhängig.
          </p>
        </div>
      </div>
    </div>
  );
}
