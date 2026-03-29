import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function DigitalServicesAct() {
  usePageMeta("Digital Services Act · Audi Düsseldorf", "Informationen zum Digital Services Act bei Audi Düsseldorf.");
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

        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Digital Services Act</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Gesetz über digitale Dienste (Digital Services Act | „DSA")</h2>

          <p>Angaben zur Verordnung (EU) 2022/2065 des Europäischen Parlaments und des Rates vom 19. Oktober 2022 über einen Binnenmarkt für digitale Dienste und zur Änderung der Richtlinie 2000/31/EG (Digital Services Act).</p>

          <p>Uns, der AUDI AG („Audi", „wir"), ist ein sicheres, faires und vertrauenswürdiges Online-Umfeld sehr wichtig. Wir möchten daher Nutzer/innen unserer Vermittlungsdienste im Sinne von Art. 3 lit. g) DSA wie folgt informieren:</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Was ist der DSA?</h2>
          <p>Der DSA ist ein neues Gesetz der EU, das für mehr Sicherheit und Fairness im digitalen Umfeld sorgen soll.</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Kontaktstelle</h2>
          <p>Unsere zentrale Kontaktstelle für Nutzer/innen unserer Vermittlungsdienste sowie Behörden der Mitgliedstaaten, die Kommission und das in Art. 61 DSA genannte Gremium hinsichtlich DSA-Belange ist folgende E-Mail-Adresse: dsa@audi.de.</p>
          <p>Die Kommunikation mit uns kann auf Deutsch oder Englisch erfolgen.</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Meldung rechtswidriger Inhalte</h2>
          <p>Personen und Einrichtungen können Informationen zu aus ihrer Sicht rechtswidrigen Inhalten im Kontext unserer Hosting-Dienste – einschließlich Online-Plattformen – mittels der E-Mail-Adresse dsa@audi.de melden.</p>
          <p>In den Meldungen sind folgende gesetzlich geforderten Elemente mitzuteilen:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>eine hinreichend begründete Erläuterung, warum die fraglichen Informationen als rechtswidrige Inhalte angesehen werden;</li>
            <li>eine eindeutige Angabe des genauen elektronischen Speicherorts dieser Informationen, etwa die präzise URL-Adresse bzw. die präzisen URL-Adressen, oder, soweit erforderlich, weitere, hinsichtlich der Art der Inhalte und der konkreten Art des Dienstes zweckdienliche Angaben zur Ermittlung der rechtswidrigen Inhalte;</li>
            <li>Namen und E-Mail-Adressen der meldenden Person, es sei denn, es handelt sich um Informationen, bei denen davon ausgegangen wird, dass sie eine in den Artikeln 3 bis 7 der Richtlinie 2011/93/EU genannte Straftat betreffen;</li>
            <li>eine Erklärung darüber, dass die meldende Person in gutem Glauben davon überzeugt ist, dass die in der Meldung enthaltenen Angaben und Anführungen richtig und vollständig sind.</li>
          </ul>
          <p>Wir werden der meldenden Person unverzüglich unsere Entscheidung hinsichtlich der gemeldeten Information mitteilen und auf etwaige Rechtsbehelfe gegen die Entscheidung hinweisen.</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Inhaltemoderation</h2>
          <p>Wenn Vertragspartner der AUDI AG oder Nutzer von digitalen Diensten der AUDI AG gegen ihren Nutzungsvertrag oder gesetzliche Vorschriften verstoßen oder rechtswidrige Inhalte bereitstellen oder anderweitig Rechte Dritter verletzen, kann AUDI AG die Zurverfügungstellung der digitalen Dienste einschränken oder sperren. Die Sanktionsmöglichkeiten reichen von der Verwarnung über die Löschung einzelner Inhalte bis zur vorläufigen oder endgültigen Sperrung des Zugangs. Bei der Auswahl der jeweiligen Sanktion berücksichtigt AUDI AG die Schwere des Verstoßes und die berechtigen Interessen der Betroffenen einschließlich eines etwaigen Verschuldens und des Verschuldensgrads.</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">5. Beschwerden und Außergerichtliche Streitbeilegung</h2>
          <p>Gegen Entscheidungen im Rahmen der Inhaltemoderation kann der betroffene Nutzer interne Beschwerde bei der AUDI AG über die in der Entscheidung genannte Kontaktadresse einlegen oder sich an eine zertifizierte außergerichtliche Streitbeilegungsstelle nach dem Digital Services Act wenden. AUDI AG wird mit der vom Nutzer ausgewählten zertifizierten Streitbeilegungsstelle zusammenarbeiten. Die Entscheidung der Streitbeilegungsstelle ist für AUDI AG nicht bindend, außer AUDI AG hat die Entscheidung ausdrücklich als bindend akzeptiert.</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">6. Nutzerzahlen</h2>
          <p>Information zur Nutzerzahl: Nach Art. 24 Abs. 2 des DSA müssen Online-Plattformen Angaben zur durchschnittlichen Zahl ihrer monatlichen aktiven Nutzer in der EU veröffentlichen. Bei allen von der AUDI AG angebotenen Online-Plattformen lag die durchschnittliche Zahl der monatlich aktiven Nutzer in der EU in den vergangenen sechs Monaten erheblich unter dem maßgeblichen Schwellenwert von 45 Millionen Nutzern.</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">7. Transparenzbericht</h2>
          <p>Die AUDI AG veröffentlicht einmal jährlich einen gesetzlich vorgeschriebenen Transparenzbericht, der Informationen über die Moderation von Inhalten auf digitalen Diensten enthält.</p>
        </div>
      </div>
    </div>
  );
}
