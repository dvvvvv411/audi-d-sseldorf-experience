import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Datenschutzinformation() {
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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Datenschutzinformation audi.de</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          {/* A. Gegenstand */}
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">A. Gegenstand der Datenverarbeitung</h2>
          <p>
            In dieser Datenschutzinformation gem. Art. 13, 14 EU-DSGVO informieren wir Sie über die Verarbeitung Ihrer personenbezogenen Daten durch die AUDI AG, Auto-Union-Straße 1, 85057 Ingolstadt, Deutschland („wir" oder „Audi") im Zusammenhang mit der Nutzung der Webseite www.audi.de.
          </p>
          <p>
            Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung oder zu einem oder mehreren besonderen Merkmalen, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind, identifiziert werden kann. Verarbeitung meint jeden mit oder ohne Hilfe automatisierter Verfahren ausgeführten Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten wie das Erheben, das Erfassen, die Organisation, das Ordnen, die Speicherung, die Anpassung oder Veränderung, das Auslesen, das Abfragen, die Verwendung, die Offenlegung durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.
          </p>

          {/* B. Allgemeine Informationen */}
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">B. Allgemeine Informationen</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">I. Wer ist für die Datenverarbeitung verantwortlich?</h3>
          <p>
            Verantwortlicher für die Verarbeitung Ihrer personenbezogenen Daten ist:<br />
            AUDI AG, Auto-Union-Straße 1, 85057 Ingolstadt, Deutschland.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">II. An wen kann ich mich wenden?</h3>
          <p>
            Wenn Sie Ihre Datenschutzrechte geltend machen wollen, nutzen Sie bitte die Kontaktmöglichkeiten über https://data-subject-rights.Audi.com/.
          </p>
          <p>
            Dort finden Sie weitere Informationen, wie Sie Ihre Datenschutzrechte geltend machen können. Postalisch können Sie sich hierfür auch an folgende Anschrift wenden:<br />
            AUDI AG, DSGVO-Betroffenenrechte, 85045 Ingolstadt
          </p>
          <p>
            Wenn Sie allgemeine Fragen zu dieser Datenschutz-Information oder zur Verarbeitung Ihrer personenbezogenen Daten durch Audi haben, nutzen Sie bitte folgende Kontaktmöglichkeiten:
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">III. Kontaktdaten des Datenschutzbeauftragten</h3>
          <p>
            Bei Anliegen zum Datenschutz können Sie sich auch an unseren betrieblichen Datenschutzbeauftragten wenden:<br />
            AUDI AG, Datenschutzbeauftragter, 85045 Ingolstadt, Deutschland<br />
            E-Mail: datenschutz@Audi.de
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">IV. Welche Rechte habe ich?</h3>
          <p>Als betroffener Person stehen Ihnen generell die folgenden Datenschutzrechte zu:</p>

          <p className="font-semibold mt-4">über Ihr Widerspruchsrecht</p>

          <p className="font-semibold mt-4">a) Widerspruchsrecht aus persönlichen Gründen</p>
          <p>
            Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen. Voraussetzung hierfür ist, dass die Datenverarbeitung im öffentlichen Interesse oder auf der Grundlage einer Interessenabwägung erfolgt. Dies gilt auch für ein Profiling.
          </p>
          <p>
            Soweit wir die Verarbeitung Ihrer personenbezogenen Daten auf eine Interessenabwägung stützen, gehen wir grundsätzlich davon aus, dass wir zwingende schutzwürdige Gründe nachweisen können, werden jedoch selbstverständlich jeden Einzelfall prüfen.
          </p>
          <p>Im Falle eines Widerspruchs werden wir Ihre personenbezogenen Daten nicht mehr verarbeiten. Es sei denn,</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>wir können zwingende schutzwürdige Gründe für die Verarbeitung dieser Daten nachweisen, die Ihre Interessen, Rechte und Freiheiten überwiegen oder</li>
            <li>Ihre personenbezogenen Daten dienen der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen.</li>
          </ul>

          <p className="font-semibold mt-4">b) Widerspruch gegen die Verarbeitung Ihrer Daten für unsere Direktwerbung</p>
          <p>
            Soweit wir Ihre personenbezogenen Daten verarbeiten, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung Sie betreffender personenbezogener Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.
          </p>
          <p>
            Widersprechen Sie der Verarbeitung für Zwecke der Direktwerbung, so werden wir Ihre personenbezogenen Daten nicht mehr für diese Zwecke verarbeiten.
          </p>

          <p className="font-semibold mt-4">c) Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten für Produktverbesserung und allgemeiner Kundenanalyse</p>
          <p>
            Im Rahmen der Interessenabwägung räumen wir Ihnen ein gesondertes Widerspruchsrecht hinsichtlich der Verarbeitung Ihrer personenbezogenen Daten für Produktverbesserung und allgemeiner Kundenanalyse ein.
          </p>
          <p>
            Widersprechen Sie der Verarbeitung für Zwecke der Produktverbesserung und/oder allgemeinen Kundenanalyse, werden wir Ihre Daten nicht mehr mit Personenbezug für diese Zwecke verarbeiten. Rein statistische Auswertungen aggregierter oder auf andere Weise anonymisierter Daten bleiben hiervon unberührt.
          </p>

          <p className="font-semibold mt-4">d) Ausübung des Widerspruchsrechts</p>
          <p>
            Der Widerspruch kann formfrei erfolgen und sollte möglichst an die in diesem Datenschutzhinweis aufgeführten Kontaktdaten im Abschnitt B.II. erfolgen.
          </p>

          {/* C. Datenverarbeitung */}
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">C. Datenverarbeitung in der alleinigen Verantwortlichkeit von Audi</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">I. Welche Daten verarbeiten wir und aus welchen Quellen stammen diese?</h3>

          <p className="font-semibold mt-4">1. Zugriff auf die Webseite</p>
          <p>
            Bei jeder Nutzung der Webseite werden von Ihrem Internet-Browser automatisch bestimmte Informationen übermittelt und von uns in sogenannten Log-Dateien gespeichert.
          </p>
          <p>Es werden insbesondere folgende Informationen automatisch übermittelt:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>IP-Adresse (Internetprotokoll-Adresse) des Endgeräts, von dem aus auf das Online-Angebot zugegriffen, wird;</li>
            <li>Internetadresse der Webseite, von der aus das Online-Angebot aufgerufen wurde (sog. Herkunfts- oder Referrer-URL);</li>
            <li>Name des Service-Providers, über den der Zugriff auf das Online-Angebot erfolgt;</li>
            <li>Name der abgerufenen Dateien bzw. Informationen;</li>
            <li>Datum und Uhrzeit sowie Dauer des Abrufs;</li>
            <li>übertragene Datenmenge;</li>
            <li>Betriebssystem und Informationen zum verwendeten Internet-Browser einschließlich installierter Add-Ons (z.&nbsp;B. für den Flash Player);</li>
            <li>http-Status-Code (z.&nbsp;B. „Anfrage erfolgreich" oder „angeforderte Datei nicht gefunden").</li>
          </ul>
          <p>
            In den Log-Dateien werden die vorstehenden Daten ohne Ihre vollständige IP-Adresse gespeichert, so dass kein Rückschluss auf Ihre IP-Adresse möglich ist.
          </p>
          <p>
            Wir verarbeiten die vorgenannten Daten, damit Sie über ihr Endgerät unsere Webseite besuchen können. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 Buchst. b DSGVO. Ferner verarbeiten wir diese Daten zur Wahrung unserer berechtigten Interessen (Art. 6 Abs. 1 Buchst. f DSGVO), um unsere Dienste anzubieten und unsere IT Infrastruktur vor Angriffen zu schützen. Sofern und solange wir auf Basis gesetzlicher Anforderungen die vorgenannten Log-Dateien darüber hinaus speichern, erfolgt die Speicherung zur Erfüllung unserer gesetzlichen Pflichten (Art. 6 Abs. 1 Buchst. c DSGVO).
          </p>

          <p className="font-semibold mt-4">2. Nutzung der Webseite / von Ihnen angegebene Daten</p>
          <p>
            Grundsätzlich können Sie auf unsere Webseite zugreifen, ohne personenbezogene Daten anzugeben. Wir verarbeiten personenbezogene Daten, die Sie im Rahmen der Nutzung der Webseite angeben [z.B. im Rahmen der Registrierung oder Nutzung der Kontaktformulare].
          </p>
          <p>Zu den relevanten personenbezogenen Daten gehören:</p>

          <div className="ml-4 space-y-2">
            <p className="font-semibold">Private Kontakt- und Stammdaten</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Kontaktdaten (privat)</li>
              <li>Identifikationsdaten</li>
            </ul>

            <p className="font-semibold">Berufliche Arbeits- und Organisationsdaten</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Kontaktdaten (beruflich)</li>
              <li>Arbeitsorganisatorische Zuordnung(en)</li>
              <li>Entgelt- und Zeitwirtschaftsdaten</li>
              <li>Leistung und Ziele</li>
              <li>Bewerbungsdaten</li>
            </ul>

            <p className="font-semibold">Daten zu persönlichen Verhältnissen und Präferenzen</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Familiäre Verhältnisse</li>
              <li>Persönliche Präferenzen</li>
              <li>Mitgliedschaften und Ehrenämter</li>
            </ul>

            <p className="font-semibold">Aufnahmen</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Filmaufnahmen</li>
              <li>Fotoaufnahmen</li>
              <li>Tonaufnahmen</li>
            </ul>

            <p className="font-semibold">Fahrzeugstammdaten u. -identifikation</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Fahrzeugidentifikationsdaten</li>
              <li>Fahrzeugstammdaten</li>
            </ul>

            <p className="font-semibold">KFZ-Nutzungsdaten (Fahrzeugnutzungs- und betriebsdaten)</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Innenraum-Sensorik</li>
              <li>Umfeld-u. Fahrsensorik</li>
              <li>Online Fahrzeugdaten (KfZ Betriebswerte)</li>
              <li>Online übertragene Ereignisspeicherdaten</li>
              <li>Car-2-X-Daten</li>
              <li>Unfalldaten</li>
              <li>Smartphone-Integration (Komforteinstellungen, Multimedia, Navigation)</li>
              <li>Nutzungsdaten Infotainment / Navigation</li>
              <li>Komforteinstellungen</li>
              <li>Daten zu Straftaten / Ordnungswidrigkeiten</li>
              <li>Daten zu Fahrzeughistorie und Werkstattaufenthalten</li>
            </ul>

            <p className="font-semibold">Fahrzustand und Betrieb</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Daten zur Abwicklung von Garantie und Service</li>
              <li>Ereignisspeicherdaten</li>
            </ul>

            <p className="font-semibold">Finanzdaten</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Bonitätsdaten (incl. Scorewerte)</li>
              <li>Vermögens- und Eigentumsverhältnisse</li>
              <li>Zahlungsdaten und Bankinformationen</li>
            </ul>

            <p className="font-semibold">IT-Nutzungsdaten</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>User- und Anmeldedaten</li>
              <li>Protokollierungsdaten (sicherheitsrelevant)</li>
              <li>Protokollierungsdaten (betriebssicherheitsrelevant)</li>
              <li>Protokollierungsdaten (fachbezogen)</li>
              <li>Soft- und Hardwaredaten</li>
            </ul>

            <p className="font-semibold">Rechtsgeschäfte / Vertragsdaten</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Vertragsmetadaten</li>
              <li>Vollmacht und Vertretung</li>
            </ul>

            <p className="font-semibold">Standortdaten</p>
            <ul className="list-disc ml-6 space-y-0.5">
              <li>Stationäre Standortdaten</li>
              <li>Standortverlaufsdaten</li>
            </ul>

            <p className="font-semibold">Besonders sensible personenbezogene Daten</p>
          </div>

          <p>
            Wir nutzen ein sogenanntes Content Delivery Network, um unsere Webseiten-Inhalte auszuliefern und die Auslieferungsgeschwindigkeit und Sicherheit unserer Webseite zu erhöhen.
          </p>
          <p>Folgende Daten werden durch das Content Delivery Network in Logfiles verarbeitet:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>IT-Nutzungsdaten wie z.B. IP-Adresse (Internetprotokoll-Adresse) des Endgeräts, von dem aus auf das Online-Angebot zugegriffen wird,</li>
            <li>URLs der besuchten Website</li>
            <li>Datum und Uhrzeit des Zugriffs, Standort basierend auf der IP-Adresse</li>
            <li>Standort des Content Delivery Servers</li>
          </ul>

          {/* Von Ihnen angegebene Daten - Abschnitte */}
          <p className="font-semibold mt-4">Von Ihnen angegebene Daten</p>

          <p><span className="font-semibold">Konfigurator:</span> Im Fahrzeugkonfigurator können Sie Ihr Wunschfahrzeug konfigurieren. Mit Fertigstellung der Konfiguration erzeugen wir einen Audi Code, mit dem Sie die Konfiguration selbst oder bei einem Audi Partner erneut abrufen können. Wir speichern dabei lediglich die gewählte Fahrzeugkonfiguration und den zugehörigen Audi Code. Eine Zuordnung zu Ihrer Person erfolgt nicht. Sie haben zusätzlich die Möglichkeit die Konfiguration in Ihrem myAudi-Account abspeichern, um diese später erneut abzurufen. Zum Speichern müssen Sie sich mit im myAudi Portal anmelden. Wir speichern die von Ihnen hinterlegten Konfigurationen bis Sie diese selbst löschen oder Ihren myAudi Account löschen.</p>

          <p><span className="font-semibold">A-Plus:</span> Die Anwendung A-Plus-Kundeprogramm ermöglicht Ihnen exklusiven Zugang zu Events, Gewinnspielen und Verlosungen. Über unsere Webseite gelangen Sie über einen Link auf die Seite zum A-Plus-Kundenprogramm. Eine Verarbeitung Ihrer personenbezogenen Daten erfolgt erst, wenn Sie sich auf der Seite anmelden oder registrieren. Informationen zur Verarbeitung Ihrer personenbezogenen Daten im Zusammenhang mit dem A-Plus-Kundenprogramm finden Sie auf der Seite.</p>

          <p><span className="font-semibold">Audi Online Beratung:</span> Sie können über die Webseite auf die Audi Online Beratung der AUDI AG zugreifen, die Ihnen eine Live-Beratung per Video-, Textchat sowie Sprachanruf ermöglicht. Weitere Informationen zur Verarbeitung Ihrer Daten finden Sie in den Datenschutzhinweisen der Audi Online Beratung.</p>

          <p><span className="font-semibold">Audi Live Beratung:</span> Über die Audi Live Beratung kann die beratende Person Ihnen über eine von ihr verwendete Daten Brille ihr Sichtfeld freischalten. Sofern wir Ihnen diese Funktion anbieten, können Sie unter Angabe Ihrer Kontaktdaten einen Wunsch-Termin für eine Live Demo an uns senden oder während eines Gesprächs mit uns die Live Beratung über einen Zugangscode aktivieren. Hierfür verarbeiten wir die von Ihnen angegebenen Daten, d.h. Ihre Kontaktdaten (Name, Anschrift, E-Mail, Telefon) und ggf. Wunschtermin, um Sie zu dem gewünschten Termin zu kontaktieren bzw. Ihnen die Live Beratung freizuschalten. Dies erfolgt zur Erfüllung eines Vertrags mit Ihnen bzw. zur Durchführung vorvertraglicher Maßnahmen (Vertragsanbahnung), die auf Ihre Anfrage erfolgen (Art. 6 Abs. 1, Unterabs. 1 Buchst. b) DSGVO).</p>

          <p><span className="font-semibold">Kontaktformular:</span> Über das Kontaktformular können Sie mit unserer Kundebetreuung Kontakt aufnehmen. Wir verarbeiten die von Ihnen im Formular angegeben Daten sowie Ihre angegebenen Kontaktdaten (unter Einsatz eines Auftragsdatenverarbeiters) zur Bearbeitung Ihrer Anfrage. Soweit dies für die Bearbeitung erforderlich ist, übermitteln wir Ihre Daten an unsere Importeure und Audi Partner, um Ihr Anliegen umfassend zu klären, z.B. eine Beschwerde über einen konkreten Audi Partner zu klären. Wir nehmen Ihre Anliegen ernst und möchten diese auch zusammen mit den betroffenen Vertriebspartnern klären. Bitte teilen Sie uns mit, wenn Sie dies im Einzelfall nicht wünschen.</p>

          <p><span className="font-semibold">Feedbackfunktion:</span> In der Feedbackfunktion können Sie uns eine Bewertung zu unserer Webseite mitteilen. Hierbei werden keine personenbezogenen Daten verarbeitet.</p>

          <p><span className="font-semibold">Händleranfrage:</span> Sie haben die Möglichkeit, einem Audi Partner über unser Kontaktformular eine Anfrage zuzusenden. Wir verarbeiten die von Ihnen angegebenen personenbezogenen Daten und leiten diese direkt an den ausgewählten Audi Partner weiter. Bei Anfragen zur Vorvermarktung von noch in Nutzung befindlichen Fahrzeugen werden Ihre Daten zunächst an die Kundenbetreuung der AUDI AG zur Kontaktaufnahme mit Ihnen und zur Erläuterung des Prozesses bei Vorvermarktungsfahrzeugen weitergeleitet. Sollten Sie nach Erläuterung des Prozesses zu Vorvermarktungsfahrzeugen durch die Kundenbetreuung weiterhin Interesse haben, werden Ihre Daten an den ausgewählten Audi Partner weitergeleitet.</p>

          <p><span className="font-semibold">Probefahrt vereinbaren:</span> Sie können über die Webseite eine Probefahrt vereinbaren. Hierfür verarbeiten wir die von Ihnen angegebenen Kontaktdaten (Name, Anschrift, E-Mail, Telefon) sowie das gewünschte Fahrzeugmodell. Wir leiten Ihre Verbrenner-Probefahrtanfrage zur weiteren Bearbeitung und Durchführung der Probefahrt an den von Ihnen ausgewählten Audi Partner weiter. Wir verarbeiten die von Ihnen angegeben Daten aufgrund unseres berechtigten Interesses, Ihnen eine Verbrenner-Probefahrt zu vermitteln (Art. 6 Abs. 1, Unterabs. 1 Buchst. f) DSGVO). Sollten Sie eine BEV-Probefahrtanfrage gestellt haben, so kontaktiert Sie zunächst die Audi Kundenbetreuung (Audi Interaction GmbH) bevor Ihre Probefahrtanfrage an den von Ihnen ausgewählten Audi Partner weitergeleitet wird. Sollte die BEV-Probefahrt mit dem Audi Partner nicht zustande kommen, kontaktiert Sie die Audi Kundenbetreuung erneut, um Sie an einen anderen Audi Partner zu vermitteln. Wir verarbeiten Ihre angegebenen Daten zur Vermittlung einer BEV-Probefahrt aufgrund Ihrer Einwilligung (Art. 6 Abs. 1, Unterabs. 1 Buchst. a) DSGVO). Der Audi Partner verarbeitet die von Ihnen angegebenen Daten, um Sie zur gewünschten Terminvereinbarung zu kontaktieren zur Erfüllung eines Vertrags mit Ihnen bzw. zur Durchführung vorvertraglicher Maßnahmen (Vertragsanbahnung), die auf Ihre Anfrage erfolgen (Art. 6 Abs. 1, Unterabs. 1 Buchst. b) DSGVO) bzw. informiert uns über das Zustandekommen der BEV-Probefahrt (Artikel. 6 Abs1, Unterabs. 1 Buchst. f) DSGVO. Sofern Sie eingewilligt haben, an einer Zufriedenheitsumfrage zur Probefahrt teilzunehmen, erhalten Sie im Anschluss an Ihre Probefahrt diese per E-Mail (Art. 6 Abs. 1, Unterabs. 1 Buchst. a) DSGVO).</p>

          <p><span className="font-semibold">Serviceterminanfrage/-buchung:</span> Im Rahmen der Serviceterminanfrage/-buchung können Sie Servicetermine bei Ihrem ausgewählten Audi Service Partner anfragen und buchen. Beim Absenden Ihrer Anfrage und/oder Buchung verarbeiten wir die folgenden Daten bzw. Datenkategorien, die Sie im Rahmen der Anfrage/Buchung angegeben haben: Name, Kontaktdaten (Anschrift, Email Adresse, Mobilnummer), KfZ Kennzeichen, ungefährer Kilometerstand) und der Fahrzeug-Identifikationsnummer Ihres Audis. Wir verarbeiten die Daten zur Durchführung der konkreten Anfrage/Buchung. Wir übermitteln die Daten an Ihren ausgewählten Audi Service Partner zur Terminvereinbarung und Durchführung des Termins. Dieser verarbeitet die von Ihnen gegenüber angegebenen Daten, um Sie zur gewünschten Terminvereinbarung zu kontaktieren zur Erfüllung eines Vertrags mit Ihnen bzw. zur Durchführung vorvertraglicher Maßnahmen (Vertragsanbahnung), die auf Ihre Anfrage erfolgen (Art. 6 Abs. 1, Unterabs. 1 Buchst. b) DSGVO).</p>

          <p><span className="font-semibold">Verkaufsberatende kontaktieren:</span> Sie können über die Webseite die Verkaufsberatenden kontaktieren. Hierfür verarbeiten wir die von Ihnen angegebenen Kontaktdaten sowie das Modell, zu dem Sie Beratung wünschen. Wir leiten Ihre Anfrage zur weiteren Bearbeitung und Kontaktaufnahme an den von Ihnen ausgewählten Audi Partner weiter. Hierfür verarbeitet der Audi Partner die von Ihnen angegebenen Daten, um Sie zur gewünschten Terminvereinbarung zu kontaktieren zur Erfüllung eines Vertrags mit Ihnen bzw. zur Durchführung vorvertraglicher Maßnahmen (Vertragsanbahnung), die auf Ihre Anfrage erfolgen (Art. 6 Abs. 1, Unterabs. 1 Buchst. b) DSGVO) bzw. zur Wahrung unserer berechtigten zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1, Unterabs. 1 Buchst. f) DSGVO).</p>

          <p><span className="font-semibold">Feldmaßnahmen:</span> Über eine Abfrage auf Basis der von Ihnen eingegebenen Fahrzeug-Identifikationsnummer können Sie Feldmaßnahmen und Rückrufaktionen zu Ihrem Fahrzeug aufrufen. Sie haben zudem die Möglichkeit über die Eingabe Ihrer Fahrzeug-Identifikationsnummer aufzurufen, ob Ihr Fahrzeug von der aktuellen Diesel Aktion betroffen ist. Die von Ihnen eingegebenen Daten werden nicht gespeichert. Rückrufaktion Diesel Abgas: Sie haben zudem die Möglichkeit über eine Abfrage auf Basis Ihrer Fahrzeug-Identifikationsnummer aufzurufen, ob Ihr Fahrzeug von der aktuellen Rückrufaktion Diesel EA189 (23Q7) betroffen ist. Die von Ihnen eingegebenen Daten werden nicht gespeichert.</p>

          <p><span className="font-semibold">Gebrauchtwagenbörse-Fahrzeugsuche:</span> Nach Eingabe von Suchkriterien können Sie die Suche nach einem Gebrauchtfahrzeug in der Audi Gebrauchtwagenbörse in Ihrem myAudi-Account abspeichern und Ihre E-Mail-Adresse für Benachrichtigungen angeben. Bei Einstellung eines passenden Fahrzeugs durch einen Audi-Partner auf der Gebrauchtwagenbörse erhalten Sie eine E-Mail auf die von Ihnen hinterlegte E-Mail-Adresse. Sie können Ihre Suchaufträge in Ihrem myAudi-Account selbst verwalten und jederzeit löschen. Wir speichern Ihren Suchauftrag bis Sie diesen selbst löschen.</p>

          <p><span className="font-semibold">Newsletteranmeldung:</span> Diese Webseite bietet zudem die Möglichkeit an, einen Newsletter zu bestellen. Wir verarbeiten die von Ihnen im Zusammenhang mit der Newsletteranmeldung angegebenen Daten (E-Mail-Adresse, Name, Vorname und Anrede) zum Zweck der Zusendung des Newsletters im Rahmen Ihrer gegebenen Einwilligung (Art. 6 Abs. 1 S. 1 lit. a DSGVO). Für die Aktivierung des Newsletters verwenden wir das sog. Double-Opt-In-Verfahren, d.h. wir senden Ihnen eine E-Mail an die angegebene E-Mail-Adresse mit der Bitte um Bestätigung Ihrer Einwilligung. Sie können Ihre Einwilligung jederzeit ohne Angabe von Gründen mit Wirkung für die Zukunft gegenüber der AUDI AG widerrufen, z.&nbsp;B. über den in jedem Newsletter enthaltenen Link „Abbestellen" oder über unsere Kundenbetreuung. Sofern Sie den Newsletter abbestellen, werden Ihre personenbezogenen Daten gelöscht, sofern wir Ihre Daten nicht aufgrund einer anderen Rechtsgrundlage verarbeiten oder Aufbewahrungspflichten bestehen. Der Versand des Newsletters erfolgt durch den Einsatz eines Auftragsdatenverarbeiters.</p>

          <p><span className="font-semibold">Katalogbestellung:</span> Wenn Sie unseren aktuellen Produktkatalog bestellen möchten, verarbeiten wir auf Basis der von Ihnen gegebenen Einwilligung (Art. 6 Abs. 1 S. 1 lit. a DSGVO) die folgenden Daten zu Zwecken der Zustellung des Katalogs: Name, Vorname, Anschrift und optional E-Mail-Adresse.</p>

          <p><span className="font-semibold">Cyber Security Audi Vulnerability Reporting:</span> E-Mail-Adresse vulnerability@audi.de: Über diese E-Mail-Adresse können Sie uns Hinweise zu Cyber Security Schwachstellen/Vorfällen oder Hackerangriffen zukommen lassen. Wir verarbeiten die in Ihrer E-Mail angegebenen Informationen sowie Ihre angegebenen Kontaktdaten zur Bearbeitung Ihrer Meldung und nutzen diese ggf. für Rückfragen. Soweit dies für die Bearbeitung erforderlich ist, übermitteln wir die Informationen an andere Konzernmarken des VW Konzerns und/oder Dienstleister sowie Lieferanten von Hard- und Software, z.&nbsp;B. von Steuergeräten. Wir geben dabei lediglich solche Informationen weiter, die dem Empfänger keinen Rückschluss auf die Person des Meldenden ermöglichen. Sofern wir für die Bearbeitung der Meldung auch die Fahrzeug-Identifizierungsnummer weitergeben, sichern wir die Einhaltung der datenschutzrechtlichen Vorgaben über entsprechende datenschutzrechtliche Vereinbarungen ab.</p>

          <p><span className="font-semibold">Weitere Produktinformationen und Marktforschung:</span> Wenn Sie Informationen zu unseren Produkten und Services erhalten möchten, können Sie diese Werbung bestellen. Hierfür werden im Rahmen der von Ihnen zu gebenden Einwilligung (Art. 6 Abs. 1 S. 1 lit. a DSGVO) folgende Daten zum Zwecke der Werbezustellung verarbeitet: Name, Vorname, E-Mail-Adresse und/oder Telefonnummer). Sofern Sie in die Kontaktaufnahme per E-Mail einwilligen, verwenden wir das sog. Double-Opt-In-Verfahren, d.h. wir senden Ihnen eine E-Mail an die angegebene E-Mail-Adresse mit der Bitte um Bestätigung Ihrer Einwilligung. Wie Sie Ihre Einwilligung widerrufen können, finden Sie im Abschnitt „Welche Rechte habe ich?".</p>

          {/* Zwecke und Rechtsgrundlagen */}
          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">I. Zu welchen Zwecken verarbeiten wir Ihre Daten und auf welcher Rechtsgrundlage?</h3>
          <p>
            Wir verarbeiten Ihre personenbezogenen Daten im Einklang mit den Bestimmungen der Datenschutz-Grundverordnung (DSGVO) und des Bundesdatenschutzgesetzes (BDSG) zu verschiedenen Zwecken.
          </p>
          <p>Die Verarbeitung Ihrer personenbezogenen Daten muss auf eine der folgenden Rechtgrundlagen gestützt werden:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Sie haben Ihre Einwilligung erteilt (Art. 6 Abs. 1, Unterabs. 1 Buchst. a) DSGVO);</li>
            <li>Die Verarbeitung ist für die Erfüllung eines Vertrags mit Ihnen, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Ihre Anfrage erfolgen (Art. 6 Abs. 1, Unterabs. 1 Buchst. b) DSGVO);</li>
            <li>Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung nach EU-Recht oder dem Recht eines EU-Mitgliedsstaates erforderlich, dem wir unterliegen (Art. 6 Abs. 1, Unterabs. 1 Buchst. c) DSGVO);</li>
            <li>Die Verarbeitung ist erforderlich, um Ihre lebenswichtigen Interessen oder die eines anderen Menschen zu schützen (Art. 6 Abs. 1, Unterabs. 1 Buchst. d) DSGVO);</li>
            <li>Die Verarbeitung ist für die Wahrnehmung einer Aufgabe erforderlich, die im öffentlichen Interesse liegt oder in Ausübung öffentlicher Gewalt erfolgt, die uns übertragen wurde (Art. 6 Abs. 1, Unterabs. 1 Buchst. e) DSGVO);</li>
            <li>Die Verarbeitung ist zur Wahrung der berechtigten Interessen von Audi oder eines Dritten erforderlich, sofern nicht Ihre Interessen oder Grundrechte und Grundfreiheiten, die den Schutz personenbezogener Daten erfordern, überwiegen, insbesondere dann, wenn es sich hierbei um ein Kind handelt (Art. 6 Abs. 1, Unterabs. 1 Buchst. f) DSGVO).</li>
          </ul>

          <p>Sofern wir in Ausnahmefällen besondere Kategorien personenbezogener Daten verarbeiten, muss zusätzlich eine der folgenden Rechtgrundlagen einschlägig sein:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Sie haben Ihre ausdrückliche Einwilligung erteilt (Art. 9 Abs. 2 Buchst. a) DSGVO);</li>
            <li>Die Verarbeitung ist zum Schutz Ihrer lebenswichtigen Interessen oder denen eines anderen Menschen erforderlich (Art. 9 Abs. 2 Buchst. c) DSGVO);</li>
            <li>Die Verarbeitung bezieht sich auf personenbezogene Daten, die Sie offensichtlich öffentlich gemacht haben (Art. 9 Abs. 2 Buchst. e) DSGVO);</li>
            <li>Die Verarbeitung ist zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich (Art. 9 Abs. 2 Buchst. f) DSGVO);</li>
            <li>Die Verarbeitung ist auf der Grundlage des EU-Recht oder des Rechts eines EU-Mitgliedstaats aus Gründen eines erheblichen öffentlichen Interesses erforderlich (Art. 9 Abs. 2 Buchst. g) DSGVO).</li>
          </ul>

          {/* Zweck-Tabelle */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Zweck</th>
                  <th className="border border-gray-300 p-2 text-left">Rechtsgrundlage</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-gray-300 p-2">Kundenauftragsabwicklung, inkl. Fahrzeugfertigung sowie Erbringung digitaler Leistungen</td><td className="border border-gray-300 p-2">Vertragserfüllung, Einwilligung</td></tr>
                <tr><td className="border border-gray-300 p-2">Prävention von Rechtsverstößen und Missbrauch</td><td className="border border-gray-300 p-2">Erfüllung gesetzlicher Verpflichtungen, Interessenabwägung</td></tr>
                <tr><td className="border border-gray-300 p-2">Schadensmanagement</td><td className="border border-gray-300 p-2">Vertragserfüllung, Interessenabwägung</td></tr>
                <tr><td className="border border-gray-300 p-2">IT-Sicherheit</td><td className="border border-gray-300 p-2">Interessenabwägung</td></tr>
                <tr><td className="border border-gray-300 p-2">Veranstaltungs- und Teilnehmermanagement</td><td className="border border-gray-300 p-2">Interessenabwägung, ggf. Einwilligung</td></tr>
                <tr><td className="border border-gray-300 p-2">Rechtsangelegenheiten und Compliance</td><td className="border border-gray-300 p-2">Erfüllung einer rechtlichen Verpflichtung, Öffentliches Interesse, Vertragserfüllung</td></tr>
                <tr><td className="border border-gray-300 p-2">Kunden- und Interessentenbetreuung, Werbung</td><td className="border border-gray-300 p-2">Einwilligung, Interessenabwägung, Vertragserfüllung</td></tr>
                <tr><td className="border border-gray-300 p-2">Markt- und Meinungsforschung</td><td className="border border-gray-300 p-2">Einwilligung, Interessenabwägung</td></tr>
                <tr><td className="border border-gray-300 p-2">Kundenanalyse und Kundenbewertung</td><td className="border border-gray-300 p-2">Einwilligung, Interessenabwägung</td></tr>
                <tr><td className="border border-gray-300 p-2">Kundenanfragen und Kundenbeschwerden</td><td className="border border-gray-300 p-2">Vertragserfüllung, Einwilligung, Interessenabwägung</td></tr>
              </tbody>
            </table>
          </div>

          {/* II. Bereitstellungspflicht */}
          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">II. Besteht eine Pflicht zur Bereitstellung personenbezogener Daten?</h3>
          <p>
            Im Rahmen Ihrer Interaktion mit uns müssen Sie nur diejenigen personenbezogenen Daten bereitstellen, die für die Interaktion erforderlich sind oder zu deren Erhebung wir gesetzlich verpflichtet sind. Ohne diese Daten werden wir in der Regel Funktionen auf der Website nicht bereitstellen können oder den Abschluss des Vertrages oder die Ausführung des Auftrages ablehnen müssen oder einen bestehenden Vertrag nicht mehr durchführen können und ggf. beenden müssen.
          </p>

          {/* III. Empfänger */}
          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">III. Wer bekommt meine Daten?</h3>
          <p>Innerhalb von Audi erhalten diejenigen Stellen ihre Daten, die diese im Rahmen der Datenverarbeitung benötigen.</p>

          <p className="font-semibold mt-4">1. Auftragsverarbeiter</p>
          <p>Wir setzen Auftragsverarbeiter der folgenden Kategorien ein:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Trackingdienstleister</li>
            <li>Webagenturen</li>
            <li>Hosting-Provider</li>
            <li>Content-Delivery-Network Dienstleister</li>
            <li>Audi Kundenbetreuung (Audi Interaction GmbH)</li>
            <li>Versanddienstleister</li>
            <li>Druckdienstleister</li>
            <li>Archivierungsdienstleister</li>
            <li>IT-Service-Dienstleister</li>
          </ul>

          <p className="font-semibold mt-4">2. Dritte</p>
          <p>Zu Dritten, an die wir Ihre personenbezogenen Daten weitergeben, gehören:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Behörden und Gerichte</li>
            <li>Handelspartner</li>
            <li>Konzerngesellschaften</li>
          </ul>

          {/* IV. Drittland */}
          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">IV. Werden Daten in ein Drittland übermittelt?</h3>
          <p>
            Wir übermitteln Ihre Daten in andere Länder bzw. Drittländer. Bitte beachten Sie, dass nicht in allen Drittländern ein von der Europäischen Kommission als angemessen anerkanntes Datenschutzniveau besteht. Audi wird Ihre personenbezogenen Daten nur dann in Drittländer übermitteln, soweit dies nach Art. 44 – 49 DSGVO zulässig ist.
          </p>

          {/* V. Speicherdauer */}
          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">V. Wie lange werden meine Daten gespeichert?</h3>
          <p>
            Wir speichern Ihre Daten so lange, wie dies zur Erbringung unserer Leistungen Ihnen gegenüber erforderlich ist bzw. wir ein berechtigtes Interesse an der weiteren Speicherung haben. Wir speichern Ihre Daten für die Dauer der Nutzung der Website und darüber hinaus für die Dauer der einschlägigen gesetzlichen Aufbewahrungspflichten (i.d.R. bis zu 10 Jahre). Darüber hinaus beurteilt sich die Speicherdauer auch nach den gesetzlichen Verjährungsfristen (bis zu 30 Jahre, regelmäßige Verjährungsfrist 3 Jahre).
          </p>

          {/* D. Cookie-Informationen */}
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">D. Cookie-Informationen und Tracking Tools</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">1. Cookies</h3>
          <p>Informationen zu den auf der Seite verwendeten Cookies finden Sie in unserer Cookie Policy.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">2. User Tracking und nutzungsbasierte Online-Werbung</h3>

          <p className="font-semibold mt-4">Amazon Ad Tag</p>
          <p>
            Diese Website bindet Amazon Cookies von Amazon Europe Core S.à.r.l., Amazon EU S.à.r.l, Amazon Services Europe S.à.r.l. und Amazon Media EU S.à.r.l., alle vier ansässig in 38, avenue John F. Kennedy, L-1855 Luxemburg, sowie Amazon Digital Germany GmbH, Domagkstr. 28, 80807 München (zusammen „Amazon Europe") ein. Die Einbindung ermöglicht Conversions nachzuverfolgen, ein Retargeting der Webseitenbesucher vorzunehmen und zusätzliche Informationen über die Amazon-Nutzer zu gewinnen. Die erhobenen Informationen werden über die Technologie der des Amazon Ad Tag Cookies / Pixel („AAT") gewonnen. Der AAT wird nur nach einer Einwilligung des Nutzers, gesetzt.
          </p>
          <p>Nachfolgende Informationen werden durch den AAT ermittelt: URL, Referrer-URL, IP-Adresse, Geräte- und Browsereigenschaften, Zeitstempel und Seitenansichten, Tag-ID und Werbe-ID.</p>
          <p>Die auf der Website erfassten Interaktionen der Nutzer werden nicht länger als 13 Monate gespeichert. Rechtsgrundlage für die Übermittlung der personenbezogenen Daten an Amazon ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO. Ihre Einwilligung gilt für einen Zeitraum 90 Tagen.</p>

          <p className="font-semibold mt-4">User Tracking</p>
          <p>
            Um Ihnen einen sicheren und störungsfreien Zugriff auf unsere Webseiten zu ermöglichen, verwenden wir das Tool "Track.js". Damit können wir bei möglichen Störungsfällen fortlaufend die Kompatibilität von unseren Webinhalten (Content) mit Ihrem Betriebssystem/Browserversion analysieren und verbessern. Dabei werden keinerlei personenbezogener Daten von Ihnen (auch keine IP Adresse) erhoben, verarbeitet oder genutzt.
          </p>

          <p className="font-semibold mt-4">Nutzungsbasierte Online-Werbung</p>
          <p>
            Nutzungsbasierte Online-Werbung, auch Targeting genannt, ermöglicht es werbetreibenden Unternehmen den Nutzer bei der Werbeauslieferung zu identifizieren und einer Zielgruppe zuzuweisen. Zur Erfassung Ihres Nutzungsverhaltens wird ein Cookie auf Ihrem Rechner gespeichert. Erfasst werden dabei Informationen über Ihre Aktivitäten auf den von Ihnen besuchten Websites. Diese Informationen werden in anonymisierter Form gespeichert, sodass eine persönliche Identifikation grundsätzlich ausgeschlossen ist.
          </p>

          <p className="font-semibold mt-4">DoubleClick / Google</p>
          <p>DoubleClick (Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA)</p>

          <p className="font-semibold mt-4">Google AdWords User Lists</p>
          <p>
            Wir verwenden hierzu die Google AdWords User Lists der Google Ireland Ltd, Gordon House, Barrow Street, Dublin 4, Irland („Google"). Unsere Webseite verwendet ein von Google bereitgestelltes Pixel, das eine direkte Verbindung zu den Google-Servern herstellt.
          </p>

          <p className="font-semibold mt-4">Google Remarketing</p>
          <p>
            Unsere Webseite verwendet die Remarketing- oder "Ähnliche Zielgruppen"-Funktion der Google Inc. („Google"). Mittels dieser Funktion können die Besucher der Websites zielgerichtet mit Werbung angesprochen werden. Zur Durchführung der Analyse der Webseiten-Nutzung setzt Google sog. Cookies ein.
          </p>

          <p className="font-semibold mt-4">Floodlights</p>
          <p>
            Einer dieser sogenannten „Third-Party-Cookies" gehört zu unserem Partner Google Ireland Limited. Zur effizienten Nutzung verschiedener Google Produkte kann das Conversion-Tracking-System Floodlight eingesetzt werden. Mit Floodlight werden Aktivitäten auf unserer Website erfasst und mit Hilfe von Berichtsfunktionen die Conversion-Daten zusammengetragen.
          </p>

          <p className="font-semibold mt-4">Meta Pixel</p>
          <p>
            Diese Website bindet Meta Cookies von Meta Platforms Ireland Limited, Block J, Serpentine Avenue, Dublin 4, Irland ein. Die Einbindung von Meta Cookies ermöglicht es Informationen darüber zu sammeln, wie Sie unsere Website nutzen, z.B. um Besucherinteraktionen mit Websites („Ereignisse") zu verfolgen, nachdem sie auf eine Anzeige geklickt haben, die auf Facebook oder anderen von Meta bereitgestellten Diensten geschaltet wurde („Conversion"). Die Daten dienen folgenden Zwecken: Marketing, Analyse, Retargeting, Werbung, Conversion Tracking und Personalisierung.
          </p>
          <p>Nachfolgende Informationen werden dadurch ermittelt: Angesehene Werbeanzeigen, Browser-Informationen, angesehener Inhalt, Geräteinformationen, geografischer Standort, Interaktionen mit Werbung, Services und Produkten, IP-Adresse, Marketinginformation, Pixel-ID, Referrer URL, Nutzungsdaten, Nutzerverhalten, Facebook Nutzer-ID, Gerätebestriebssystem, Geräte-ID, HTTP-Header, angeklickte Elemente, gesehene Seiten, Facebook-Cookie-Informationen, Nutzungs-/Klickverhalten, User Agent, Browser Typ.</p>
          <p>Im Folgenden werden die Empfänger der erhobenen Daten aufgelistet: Meta Platforms Inc.; Meta Platforms Ireland Ltd.</p>
        </div>
      </div>
    </div>
  );
}
