import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function EuDataAct() {
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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">EU Data Act</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-3">Vernetzte Produkte</h2>
          <p className="font-semibold">Vorvertragliche Informationen gemäß Art. 3 Abs. 2 EU-Datengesetz für vernetzte Produkte</p>

          <p>Unsere Fahrzeuge gelten als "vernetzte Produkte" im Sinne des EU-Datengesetzes. Sie werden auf unterschiedlichen Plattformen entwickelt und produziert und decken somit eine Vielzahl von Möglichkeiten der Datenerhebung ab. Jedes Fahrzeug verfügt über Steuergeräte, Stauräume und in neuerdings auch über mobile Kommunikationseinheiten. So können Daten nicht nur an Bord gespeichert werden, sondern auch über mobile Verbindungen oder andere Übertragungsmethoden übertragen werden. Beispiele für solche Daten sind Statusdaten (z. B. Fahrzeugsperrstatus, Fensterstatus, Kraftstoffstatus), Nutzungsdaten (Lenkung, Fahrzeugfunktionen, Beschleunigung, Gangfrequenz, Bremsbetätigung, Beleuchtung), Klima (Heizung, Klima) und andere Funktionen. Die Speicherung oder Übertragung von Daten kann durch verschiedene Faktoren wie Speicherplatz und/oder mobile Datenkapazität eingeschränkt sein.</p>

          <p><strong>Allgemeiner Hinweis:</strong> Aufgrund der Vielzahl unserer Fahrzeugtypen mit unterschiedlichen Konfigurationsmöglichkeiten ist eine detaillierte Beschreibung für jedes einzelne Fahrzeug nicht realisierbar. Um den Anforderungen an eine transparente und leicht verständliche Information gerecht zu werden, stellen wir Informationen auf generischer Basis zur Verfügung.</p>

          <p>Unterschiedliche Fahrzeuge können je nach Faktoren wie Fahrzeugmodell, Produktionsdatum, Konfiguration, Betriebsland und Benutzereinstellungen unterschiedliche Arten von Daten generieren. Die Daten werden in der Regel in technisch maschinenlesbaren Formaten wie JSON, XMLs, Protobufs und anderen generiert. Weitere Informationen finden Sie im Data Dictionary, das einen detaillierten Überblick bietet.</p>

          <p>Der Umfang der gesammelten Daten hängt von mehreren Parametern ab, wie z. B. der Fahrzeugkonfiguration, den Benutzerpräferenzen und dem Nutzerverhalten. Dies kann Folgendes umfassen:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Fahrzeugkonfiguration wie abonnierte Dienste, Fahrzeugmodell, Fahrzeugplattform.</li>
            <li>Benutzereinstellungen: Aktivierte Funktionen im Fahrzeug und Nutzung von Diensten, die mit der mobilen Anwendung verbunden sind.</li>
            <li>Nutzerverhalten: Anzahl der mit dem Fahrzeug gefahrenen Kilometer und typische Nutzungszeit pro Tag.</li>
          </ul>
          <p>Weitere Informationen zu Datentypen, Zugänglichkeit und Formaten sowie Volumen oder Dimension finden Sie im Datenwörterbuch.</p>

          <p>In der Regel können Daten kontinuierlich und in Echtzeit innerhalb des Fahrzeugs generiert werden. Unsere Fahrzeuge sind in der Lage, Daten an Bord oder in Backends zu speichern. Backends sind Remote-Speicher (Server oder Cloud-Lösungen), die von Dritten für die Marken des Volkswagen Konzerns bereitgestellt werden können. Die Aufbewahrungsdauer der erhobenen Daten hängt von der Art der Daten und dem Zweck des Anwendungsfalls ab. Ist der Zweck erfüllt und bestehen keine Aufbewahrungspflichten, werden die Daten in der Regel gelöscht. Die von unseren Fahrzeugen generierten Daten können über das EU Data Act Portal abgerufen werden. Dabei handelt es sich um Self-Service-Plattformen, die für die Marken des Volkswagen Konzerns konzipiert und von der Group Information Services AG betrieben werden, um Datenabfragen einfach und effizient mit minimalen manuellen Eingriffen zu gestalten. Um eine Datenanfrage zu stellen, besuchen Sie bitte das EU Data Act Portal und befolgen Sie die beschriebenen Schritte.</p>

          <p>Data Dictionary: https://eu-data-act.drivesomethinggreater.com/de/de/service/pre-contractual-information.html</p>
          <p>Vorvertragliche Informationen: https://eu-data-act.drivesomethinggreater.com/de/de/service/pre-contractual-information.html</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Verbundene Dienste</h2>
          <p className="font-semibold">Vorvertragliche Informationen gemäß Art. 3 Abs. 3 EU-Datengesetz für damit verbundene Dienstleistungen</p>

          <p>Die AUDI AG bietet ein breites Spektrum an damit verbundenen Dienstleistungen an. Diese Dienstleistungen umfassen z.B. die Fernsteuerung der Fahrzeugfunktionen an Bord (z. B. Öffnen und Verriegeln des Fahrzeugs, Klima, Statusprüfung der Batterie, Reichweite und andere) und zusätzliche Off-Board-Funktionen (z. B. Ortung, Routenplanung und Weiterleitung). Weitere Informationen finden Sie auf unserer Website.</p>

          <p>Verschiedene verwandte Dienste (z. B. mobile Anwendungen und In-Car-Services) erfassen verschiedene Arten von Produktdaten, abhängig von Faktoren wie Fahrzeugmodell, Produktionsdatum, Konfiguration, Betriebsland und Benutzereinstellungen. Folglich ist es nicht möglich, den genauen Umfang und die Häufigkeit der Erhebung von Produktdaten, die von den einzelnen verbundenen Diensten generiert werden, anzugeben, da dies je nach den in Anspruch genommenen spezifischen Diensten und den enthaltenen Funktionen variiert. Im Interesse der Transparenz gegenüber dem Nutzer wurde ein Data Dictionary als zentrales Dokumentationsinstrument entwickelt, das Details zu allen Arten von Daten liefert, die erhoben werden. Dieses Data Dictionary liefert alle notwendigen Informationen zu bestimmten Datenpunkten und ermöglicht es dem Benutzer zu verstehen, welche Daten die entsprechenden Dienste generieren.</p>

          <p>Verwandte Dienste sind in der Lage, Daten auf dem Gerät (z.B. Fahrzeug) oder auf den jeweiligen Backends zu speichern. Backends sind Remote-Speicher (Server oder Cloud-Lösungen), die von Dritten für die Marken des Volkswagen Konzerns bereitgestellt werden können. Die Aufbewahrungsdauer der erhobenen Daten hängt von der Art der Daten und dem Zweck des Anwendungsfalls ab. Ist der Zweck erfüllt und bestehen keine Aufbewahrungspflichten, werden die Daten in der Regel gelöscht.</p>

          <p>Verschiedene verwandte Dienste (z. B. Apps und In-Car-Dienste) erfassen je nach Faktoren wie Fahrzeugmodell, Konfiguration, Betriebsland und Benutzereinstellungen verschiedene Arten von zugehörigen Dienstdaten. Folglich ist es nicht möglich, den genauen Umfang der von den einzelnen verbundenen Diensten generierten Daten zu spezifizieren, da dies je nach den in Anspruch genommenen spezifischen Diensten und den enthaltenen Funktionen variiert. Im Interesse der Transparenz gegenüber dem Nutzer wurde ein Data Dictionary als zentrales Dokumentationsinstrument entwickelt, das Details zu allen Arten von Daten liefert, die erhoben werden. Dieses Data Dictionary liefert alle notwendigen Informationen zu bestimmten Datenpunkten und ermöglicht es dem Benutzer zu verstehen, welche Daten die entsprechenden Dienste generieren. Zugehörige Servicedaten werden auf dem Gerät (z.B. Fahrzeug) oder auf den jeweiligen Backends gespeichert. Backends sind Remote-Speicher (Server oder Cloud-Lösungen), die von Dritten für die Marken des Volkswagen Konzerns bereitgestellt werden können. Die Aufbewahrungsdauer der erhobenen Daten hängt von der Art der Daten und dem Zweck des Anwendungsfalls ab. Ist der Zweck erfüllt und bestehen keine Aufbewahrungspflichten, werden die Daten in der Regel gelöscht. Die Daten können über das EU Data Act Portal abgerufen werden. Dabei handelt es sich um Self-Service-Plattformen, die für die Marken des Volkswagen Konzerns konzipiert und von der Group Information Services AG betrieben werden, um Datenabfragen einfach und effizient mit minimalen manuellen Eingriffen zu gestalten. Um eine Datenanfrage zu stellen, besuchen Sie bitte das EU Data Act Portal und befolgen Sie die beschriebenen Schritte.</p>

          <p>Die Datenverarbeitung erfolgt nur auf einer Rechtsgrundlage gemäß Artikel 6 EU-Datenschutz-Grundverordnung (DSGVO) und/oder den damit verbundenen Datenschutzgesetzen. Ebenso beruht die Verwendung nicht personenbezogener Daten allein auf der vertraglichen Vereinbarung mit dem Nutzer gemäß Art. 4.13/4.14 DA. Die vertretenen Marken des Volkswagen Konzerns können die Daten abhängig für ihre eigenen Zwecke verwenden, z. B. zur Bereitstellung vernetzter Dienste, für Forschung und Entwicklung von Fahrzeugen und Dienstleistungen, für Updates oder Produktanalysen sowie für die Entwicklung und/oder Bereitstellung zukünftiger Dienste. Darüber hinaus können die Marken Daten oder Informationen zu vereinbarten Zwecken und/oder berechtigten Interessen der Marken des Volkswagen Konzerns an Dritte weitergeben. Diese Zwecke können unter anderem die Zusammenarbeit mit Technologiepartnern zur Integration fortschrittlicher Funktionen, Partnerschaften mit Forschungseinrichtungen zur Förderung des wissenschaftlichen Fortschritts und die Zusammenarbeit mit Dienstleistern umfassen, um nahtlose und effiziente Benutzererlebnisse zu bieten.</p>

          <p>Wenn die Weitergabe von Daten an einen Dritten gewünscht wird, stellt der Dritte einen Link zur Verfügung, der zum EU Data Act Portal führt. Von dort aus kann ein einfacher Schritt-für-Schritt-Prozess befolgt werden, um die Anfrage zur Datenfreigabe zu initiieren. Der Vorgang ist schnell und erfordert nur wenige Klicks. Einzelheiten zu den Einschränkungen und dem Ende der Weitergabe finden Sie im obigen Abschnitt. Die Datenweitergabe kann jederzeit im EU Data Act Portal unter dem Kontobereich gestoppt werden. Alternativ kann die VW GIS AG kontaktiert werden, um die Datenweitergabe über einen Dritten des EU-Datengesetzes über das Kontaktformular auf dem EU-Datengesetz-Portal zu beantragen.</p>

          <p>Eine Beschwerde kann jederzeit gemäß Art. 37 des Datengesetzes eingereicht werden, indem Sie sich an die örtlichen Behörden wenden. Die zuständige Kommune wird von der jeweiligen Regierung benannt.</p>

          <p>Die angeforderten Daten können Geschäftsgeheimnisse enthalten und können daher durch zusätzliche Maßnahmen geschützt werden. In diesem Fall wird der Nutzer entsprechend informiert. Der Vertrag endet automatisch, wenn das vernetzte Produkt zerstört oder beschädigt wird, so dass es keine Daten mehr erzeugen kann, oder wenn der Nutzer nicht mehr Eigentümer oder vertraglich berechtigt ist, das vernetzte Produkt und/oder die damit verbundenen Dienste zu nutzen. Die Bedingungen (einschließlich Laufzeit und Kündigung) richten sich nach den jeweils verbundenen Leistungen.</p>

          <p>Data Dictionary: https://eu-data-act.drivesomethinggreater.com/de/de/service/pre-contractual-information.html</p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Kontaktdaten Dateninhaber / Dienstleister</h2>
          <p>Hier finden Sie die jeweiligen Informationen des Dateninhabers.</p>

          <p className="font-semibold mt-4">Inhaber der Daten:</p>
          <div>
            <p>AUDI AG</p>
            <p>Auto-Union-Str. 1</p>
            <p>85057 Ingolstadt</p>
            <p>Deutschland</p>
            <p>impressum@audi.de</p>
          </div>

          <p className="font-semibold mt-4">EU-Datengesetz Dienstleister, handelnd im Auftrag des Dateninhabers:</p>
          <div>
            <p>Volkswagen Group Info Services AG</p>
            <p>Berliner Ring 2, 38440 Wolfsburg</p>
            <p>E-Mail: gis-support@cariad.technology</p>
            <p>Tel.: +49 151 44649988</p>
          </div>

          <p className="mt-4">Für jegliche Art von Kommunikation im Zusammenhang mit dem EU-Datengesetz wenden Sie sich bitte an den Dienstleister Volkswagen Group Info Services AG.</p>
        </div>
      </div>
    </div>
  );
}
