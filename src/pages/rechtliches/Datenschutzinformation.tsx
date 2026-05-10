import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useActiveBranding } from "@/hooks/useActiveBranding";
import { useDynamicLegalReplacements } from "@/hooks/useDynamicLegalReplacements";

export default function Datenschutzinformation() {
  const { branding } = useActiveBranding();
  const company = (branding as any)?.footer_unternehmensname || branding?.name || "";
  usePageMeta(company ? `Datenschutz · ${company}` : "Datenschutz", "Datenschutzinformationen und Ihre Rechte.");
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  useDynamicLegalReplacements(contentRef);
  const logoUrl = (branding as any)?.logo_pdf_url as string | undefined;

  const addressLine = branding
    ? `${branding.strasse ?? ""}, ${branding.plz ?? ""} ${branding.stadt ?? ""}`.trim().replace(/^,\s*/, "")
    : "";

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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Datenschutzinformation</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">A. Gegenstand der Datenverarbeitung</h2>
          <p>
            In dieser Datenschutzinformation gem. Art. 13, 14 EU-DSGVO informieren wir Sie über die Verarbeitung Ihrer personenbezogenen Daten durch {company || "uns"}{addressLine ? `, ${addressLine}` : ""} („wir" oder „uns") im Zusammenhang mit der Nutzung dieser Webseite.
          </p>
          <p>
            Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen. Verarbeitung meint jeden mit oder ohne Hilfe automatisierter Verfahren ausgeführten Vorgang im Zusammenhang mit personenbezogenen Daten wie das Erheben, das Erfassen, die Organisation, die Speicherung, die Verwendung, die Offenlegung durch Übermittlung, die Einschränkung oder das Löschen.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">B. Allgemeine Informationen</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">I. Wer ist für die Datenverarbeitung verantwortlich?</h3>
          <p>
            Verantwortlicher für die Verarbeitung Ihrer personenbezogenen Daten ist:<br />
            {company}{addressLine ? <><br />{addressLine}</> : null}
            {branding?.email ? <><br />E-Mail: {branding.email}</> : null}
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">II. An wen kann ich mich wenden?</h3>
          <p>
            Wenn Sie Ihre Datenschutzrechte geltend machen wollen oder allgemeine Fragen zu dieser Datenschutzinformation oder zur Verarbeitung Ihrer personenbezogenen Daten haben, nutzen Sie bitte die oben genannten Kontaktmöglichkeiten.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">III. Welche Rechte habe ich?</h3>
          <p>Als betroffene Person stehen Ihnen generell die folgenden Datenschutzrechte zu:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
            <li>Widerrufsrecht für erteilte Einwilligungen (Art. 7 Abs. 3 DSGVO)</li>
            <li>Beschwerderecht bei der zuständigen Aufsichtsbehörde (Art. 77 DSGVO)</li>
          </ul>

          <p className="font-semibold mt-4">Widerspruchsrecht</p>
          <p>
            Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, gegen die Verarbeitung Ihrer personenbezogenen Daten Widerspruch einzulegen. Voraussetzung hierfür ist, dass die Datenverarbeitung im öffentlichen Interesse oder auf der Grundlage einer Interessenabwägung erfolgt. Dies gilt auch für ein Profiling.
          </p>
          <p>
            Soweit wir Ihre personenbezogenen Daten zur Direktwerbung verarbeiten, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung Ihrer Daten zum Zwecke derartiger Werbung einzulegen.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">C. Datenverarbeitung im Einzelnen</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">1. Zugriff auf die Webseite (Server-Logs)</h3>
          <p>
            Bei jeder Nutzung der Webseite werden von Ihrem Internet-Browser automatisch bestimmte Informationen übermittelt und von uns in sogenannten Log-Dateien gespeichert.
          </p>
          <p>Es werden insbesondere folgende Informationen automatisch übermittelt:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>IP-Adresse des Endgeräts, von dem aus auf das Online-Angebot zugegriffen wird</li>
            <li>Internetadresse der Webseite, von der aus das Online-Angebot aufgerufen wurde (Referrer-URL)</li>
            <li>Name der abgerufenen Dateien bzw. Informationen</li>
            <li>Datum, Uhrzeit und Dauer des Abrufs</li>
            <li>Übertragene Datenmenge</li>
            <li>Betriebssystem und Browser-Informationen</li>
            <li>HTTP-Status-Code</li>
          </ul>
          <p>
            Wir verarbeiten diese Daten, damit Sie unsere Webseite besuchen können. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b und f DSGVO.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">2. Kontaktformulare und Anfragen</h3>
          <p>
            Über unsere Kontaktformulare können Sie Anfragen zu Fahrzeugen, Probefahrten, Servicelterminen oder anderen Themen an uns senden. Wir verarbeiten die von Ihnen angegebenen Kontaktdaten (Name, Anschrift, E-Mail-Adresse, Telefonnummer) sowie den Inhalt Ihrer Anfrage zur Bearbeitung Ihres Anliegens. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung Ihrer Anfrage).
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">3. Newsletter</h3>
          <p>
            Sofern wir einen Newsletter anbieten, verarbeiten wir die im Rahmen der Newsletteranmeldung angegebenen Daten (E-Mail-Adresse, ggf. Name) zum Zweck des Newsletterversands auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Wir verwenden hierfür das Double-Opt-In-Verfahren. Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
          </p>

          <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">4. Cookies und Tracking</h3>
          <p>
            Informationen zu den auf unserer Webseite verwendeten Cookies und Tracking-Technologien finden Sie in unserer Cookie-Richtlinie. Marketing- und Analyse-Cookies setzen wir nur auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) ein.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">D. Empfänger Ihrer personenbezogenen Daten</h2>
          <p>
            Innerhalb unseres Unternehmens erhalten diejenigen Stellen Ihre Daten, die diese im Rahmen ihrer Tätigkeit benötigen. Darüber hinaus können Empfänger sein:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>IT- und Hosting-Dienstleister (Auftragsverarbeiter)</li>
            <li>E-Mail- und Versanddienstleister</li>
            <li>Behörden und Gerichte, soweit dies gesetzlich erforderlich ist</li>
            <li>Hersteller, Importeur oder Konzerngesellschaften, soweit dies zur Bearbeitung Ihrer Anfrage erforderlich ist</li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">E. Übermittlung in Drittländer</h2>
          <p>
            Eine Übermittlung Ihrer Daten in Länder außerhalb der EU/des EWR erfolgt nur, soweit dies nach Art. 44 ff. DSGVO zulässig ist – insbesondere auf Grundlage eines Angemessenheitsbeschlusses, geeigneter Garantien (z. B. EU-Standardvertragsklauseln) oder Ihrer ausdrücklichen Einwilligung.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">F. Speicherdauer</h2>
          <p>
            Wir speichern Ihre Daten so lange, wie dies zur Erbringung unserer Leistungen erforderlich ist bzw. wir ein berechtigtes Interesse an der weiteren Speicherung haben. Darüber hinaus speichern wir Ihre Daten für die Dauer der einschlägigen gesetzlichen Aufbewahrungspflichten (i. d. R. bis zu 10 Jahre) sowie der gesetzlichen Verjährungsfristen.
          </p>

          <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">G. Pflicht zur Bereitstellung</h2>
          <p>
            Im Rahmen Ihrer Interaktion mit uns müssen Sie nur diejenigen personenbezogenen Daten bereitstellen, die für die Interaktion erforderlich sind oder zu deren Erhebung wir gesetzlich verpflichtet sind. Ohne diese Daten werden wir in der Regel den Abschluss eines Vertrages oder die Bearbeitung Ihrer Anfrage ablehnen müssen.
          </p>
        </div>
      </div>
    </div>
  );
}
