import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Rechtliches() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/gebrauchtwagen" className="inline-block mb-4 hover:opacity-70 transition-opacity">
          <svg width="80" height="28" viewBox="0 0 188 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            <circle cx="80" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            <circle cx="120" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            <circle cx="160" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
          </svg>
        </Link>

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
