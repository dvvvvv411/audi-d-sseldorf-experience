import { Link } from "react-router-dom";

export default function Barrierefreiheit() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/gebrauchtwagen" className="inline-block mb-8 hover:opacity-80 transition-opacity">
          <svg width="80" height="28" viewBox="0 0 188 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            <circle cx="80" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            <circle cx="120" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
            <circle cx="160" cy="40" r="28" stroke="black" strokeWidth="5" fill="none"/>
          </svg>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Informationen zur Barrierefreiheit</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Unser Dienst einfach erklärt:</h2>
            <p className="mb-3">Wir bieten über www.audi.de die Möglichkeit an,</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Informationen über die neusten Audi Fahrzeuge, Produkte, Audi Partner, AUDI AG, Events, sowie weitere komplementäre Produkte von Dritten zu erhalten (in Form von bspw. Bildern, Videos und Informationstexten)</li>
              <li>im Rahmen verschiedener Kontaktformulare Anfragen an einen ausgewählten Audi Partner zu Themen wie Serviceterminen, Probefahrten oder Produktberatung zu senden. Wählen Sie hierzu das passende Formular beziehungsweise Thema und den gewünschten Audi Partner und geben Sie die relevanten Daten vor dem Absenden ein.</li>
              <li>im Fahrzeug Konfigurator Ihr Wunschfahrzeug zu konfigurieren. Folgen Sie hierbei den im Konfigurator aufgezeigten Schritten und wählen Sie die einzelnen Alternativ- oder Zusatzleistungen aus. Eine Bestellung von konfigurierten Fahrzeugen direkt über die Webseite ist nicht möglich. Wir zeigen Ihnen jedoch, wie Sie Kontakt zu einem lokalen Audi Partner für einen Kauf aufnehmen können und welche Finanzierungsmöglichkeiten es gibt.</li>
              <li>in der Neuwagen- und Gebrauchtwagenbörse anhand definierter Suchkriterien und Filter ihr Wunschfahrzeug zu finden. Eine Bestellung von Gebraucht- oder Neuwagen direkt über die Webseite ist nicht möglich. Wir informieren Sie jedoch über ausgewählte Finanzierungs- und Leasingmöglichkeiten und wie Sie Kontakt zu einem lokalen Audi Partner für einen Kauf aufnehmen können.</li>
              <li>von der Webseite auf, in ihrem Markt verfügbare, Shops abzuspringen, die beispielsweise den Kauf von digital Audi Produkten und Diensten (wie z.B. Connect Lizenzen) ermöglichen.</li>
              <li>sich mit Ihrem myAudi Account auf der Webseite einzuloggen, um marktspezifische, relevante, sowie personalisierte Services zu nutzen. Sie haben hier beispielsweise die Möglichkeit der Fahrzeuganlage im Account sowie der Anzeige von Ausstattungsdetails, der Speicherung von konfigurierten Fahrzeugen oder Kartenmaterial für Ihr Navigationssystem im Fahrzeug herunterzuladen. Klicken Sie hierfür einfach auf das Icon, auf dem eine Person dargestellt wird, im Menü oben rechts und melden Sie sich mit Ihren myAudi Accountdaten an. Sollten Sie noch keinen myAudi Account haben, so werden Sie in die Registrierungsstrecke weitergeleitet. Für die Erstellung eines myAudi Accounts geben Sie bitte die dort erforderlichen Daten ein: Benutzername (E-Mail-Adresse), Passwort, Name, Vorname.</li>
            </ul>
          </div>

          <div>
            <p className="mb-3">Wir bieten über https://www.audi.de/de/stories/audi-experiences/ die Möglichkeit an …</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Informationen über die neusten Audi Fahrzeuge, Produkte, Audi Partner, AUDI AG, Events, Gastronomie, Erlebnisangebote, Konzerte sowie weitere komplementäre Produkte von Dritten zu erhalten (in Form von bspw. Bildern, Videos und Informationstexten).</li>
              <li>von der Webseite auf, in ihrem Markt verfügbare, Shops abzuspringen, die beispielsweise den Kauf von digitalen Audi Produkten und Diensten (wie z.B. Event-Tickets) ermöglichen.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">So können Sie unseren Dienst barrierefrei nutzen</h2>
            <p className="mb-4">Nach dem Barrierefreiheitsstärkungsgesetz müssen wir unsere Dienste, die sogenannte Dienstleistungen im elektronischen Geschäftsverkehr darstellen, barrierefrei gestalten. Das bedeutet, dass insbesondere entsprechende Inhalte wie zum Beispiel Texte, Bilder aber auch bestimmte Funktionen auf unserer Webseite wahrnehmbar, bedienbar, verständlich und robust gestaltet werden müssen. Unser Dienst bietet Ihnen dafür unter anderem die folgenden Funktionen:</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">a) Wahrnehmbar</h3>
            <p>Damit Sie Inhalte auf unserem Dienst besser wahrnehmen können, haben z.B. alle Bilder eine alternative Text-Beschreibung, außer wenn Bilder rein „dekorativ" sind, das heißt, ihr Inhalt ist beispielsweise schon im Text angegeben.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">b) Bedienbar</h3>
            <p>Unser Dienst ist auch erleichtert bedienbar, so kann die Webseite z.B. per Tastatur bedient werden.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">c) Verständlich</h3>
            <p>Damit unser Dienst verständlich ist, können z.B. assistive Technologien die Sprache der Webseite erkennen.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">d) Robust</h3>
            <p>Zuletzt ist unsere Webseite auch robust, das heißt, die Kompatibilität mit verschiedenen assistiven Technologien ist sichergestellt.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Marktüberwachungsbehörde</h2>
            <p>Die zuständige Marktüberwachungsbehörde für Fragen der Einhaltung der Barrierefreiheitsanforderungen ist die Marktüberwachungsstelle der Länder für die Barrierefreiheit von Produkten und Dienstleistungen mit Sitz in Sachsen-Anhalt.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Kontakt</h2>
            <p>Sie haben Fragen oder Anregungen zur barrierefreien Gestaltung unserer Angebote? Wir sind jederzeit für Sie erreichbar. Kontaktieren Sie uns gerne über dsa@audi.de</p>
          </div>
        </div>
      </div>
    </div>
  );
}
