import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const tableClass = "w-full border-collapse border border-gray-300 text-xs text-gray-600 mt-4 mb-6";
const thClass = "border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700";
const tdClass = "border border-gray-300 px-3 py-2 align-top";

export default function CookieRichtlinie() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/gebrauchtwagen" className="inline-block mb-4 hover:opacity-80 transition-opacity">
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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Cookie Richtlinie</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-6">
          {/* 1. Allgemeine Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">1. Allgemeine Information</h2>
            <p>Die AUDI AG, Auto-Union-Straße 1, 85057 Ingolstadt ("AUDI", "wir", "uns" oder "unser/e") verarbeitet als Verantwortlicher Ihre personenbezogenen Daten, insbesondere durch Cookies und ähnliche Technologien (wie unten definiert), wenn Sie diese Webseite nutzen.</p>
            <p className="mt-3">Ihre personenbezogenen Daten können auch durch Dritte mithilfe eigener Cookies und ähnlicher Technologien verarbeitet werden. Weitere Informationen in Bezug auf solche Dritte finden Sie im Abschnitt „Third Party Cookie".</p>
            <p className="mt-3">Die Cookie Richtlinie erläutert, welche Cookies und ähnliche Technologien wir für welche Zwecke auf unserer Webseite einsetzen und welche Möglichkeiten Sie zur Verwaltung Ihrer Präferenzen haben.</p>
            <p className="mt-3">Wir setzen auf unserer Webseite Technologien ein, die die Nutzung der Webseite erleichtern und die Benutzerfreundlichkeit verbessern sollen und um verschiedene Funktionalitäten bereitzustellen (für weitere Informationen siehe Ziffern 3 und 4). Solche Technologien umfassen z.B. Cookies, Pixel und Skripte (nachfolgend „Cookies").</p>
            <p className="mt-3">Cookies sind kleine Datensätze, die auf Ihrem Gerät gespeichert werden und Daten wie z. B. persönliche Seiteneinstellungen (z.B. Sprache, Bildschirmauflösung) und Anmeldeinformationen enthalten. Dieser Datensatz wird von dem Web-Server, mit dem Sie über Ihren Browser eine Verbindung aufgebaut haben, erzeugt und an Sie gesendet.</p>
            <p className="mt-3">Weitere Informationen darüber, wie wir Ihre personenbezogenen Daten verarbeiten, einschließlich der durch Cookies erhobenen personenbezogenen Daten, wie Sie Ihre Datenschutzrechte ausüben können und die Kontaktdaten unseres Datenschutzbeauftragten, finden Sie in unserem Datenschutzhinweis.</p>
          </div>

          {/* 2. Umgang mit Cookies */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">2. Umgang mit Cookies</h2>
            <p>Grundsätzlich ist der Aufruf unserer Webseite auch ohne Cookies möglich, aber die Nutzung ohne Cookies kann die Funktion oder Verfügbarkeit der Webseite verändern. Wenn Sie aber die Funktionalitäten unserer Webseiten vollumfänglich nutzen möchten, sollten Sie die Cookies akzeptieren, die die Nutzung bestimmter Funktionen ermöglichen bzw. komfortabler machen.</p>
            <p className="mt-3">Die meisten Browser sind standardmäßig so eingestellt, dass alle Cookies automatisch akzeptiert werden. Zusätzlich zu Ihren Rechten als betroffene Person können Sie der Verwendung von Cookies jederzeit mit Wirkung für die Zukunft widersprechen, indem Sie Ihren Browser so einstellen, dass dieser keine oder nur bestimmte Cookies akzeptiert oder Sie benachrichtigt werden, sobald Cookies gesendet werden. Dies kann zur Folge haben, dass Sie nicht sämtliche Funktionen unserer Websites vollständig nutzen können.</p>
            <p className="mt-3">Bitte beachten Sie, dass sich Ihre Auswahl immer nur auf den Browser auswirkt, den Sie verwendet haben, als Sie die Auswahl getroffen haben. Falls Sie verschiedene Browser oder Endgeräte verwenden, müssen Sie möglicherweise Ihre Wahl der Cookies erneut treffen. Unter bestimmten Umständen können die Einstellungen nach Updates, oder wenn Sie die Cookies aus Ihrem Browser löschen, auf die Grundeinstellungen zurückgestellt werden, sodass wir Sie bei Ihrem nächsten Besuch unserer Webseite möglicherweise erneut dazu auffordern, Ihre Auswahl der Cookies zu treffen.</p>
            <p className="mt-3">Die folgenden Links unterstützen Sie beim Umgang mit Cookie-Browsereinstellungen. Sie können auch die „Hilfe"-Funktion Ihres Browsers nutzen, um weitere Informationen zu erhalten:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Internet Explorer, Microsoft Edge: https://support.microsoft.com/de-de</li>
              <li>Mozilla Firefox: http://support.mozilla.com/en-US/kb/Cookies</li>
              <li>Google Chrome: http://www.google.com/support/chrome/bin/answer.py?hl=en&answer=95647</li>
              <li>Safari: http://support.apple.com/kb/PH5042</li>
              <li>Opera: http://www.opera.com/browser/tutorials/security/privacy/</li>
              <li>Adobe (flash cookies): http://www.adobe.com/security/flashplayer/articles/lso/</li>
            </ul>
            <p className="mt-3">Zusätzlich gibt es Softwareprodukte, die Cookies für Sie verwalten. Weiterführende Informationen zu Cookies und dem Umgang mit Cookies finden Sie auch auf Hilfeseiten im Internet, wie beispielsweise https://www.allaboutcookies.org/.</p>
            <p className="mt-3">Wenn Sie Ihre Browsereinstellungen ändern/einstellen oder bestimmte Softwareprodukte verwenden, die Cookies blockieren, beachten wir diese Browsereinstellungen und nicht die deaktivierten Cookies in Ihren Browsereinstellungen oder über solche Softwareprodukte senden. Wenn Sie Cookies in Ihren Browsereinstellungen erlauben, werden wir Ihnen einen Cookie-Banner auf unserer Webseite präsentieren, über den Sie Ihre Cookie-Einstellungen verwalten können, z.B. um bestimmte Cookies zu aktivieren. Cookies werden nur gesetzt, wenn Sie Ihre Einwilligung für die jeweilige Cookie-Kategorie geben. Bitte beachten Sie, dass notwendige Cookies (siehe unten zu Ziffer 3) nicht Ihre Einwilligung erfordern und immer gesetzt werden, wenn Sie Cookies in Ihren Browsereinstellungen erlauben.</p>
            <p className="mt-3">Sie können Ihre Einwilligung jederzeit widerrufen und die von Ihnen ausgewählten Cookie Kategorien ändern. Bitte nutzen Sie hierfür die „Cookie-Einstellungen" in der Fußzeile der Webseite.</p>
          </div>

          {/* 3. Welche Cookies */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">3. Welche Cookies und Webtechnologien setzen wir ein?</h2>
            <p>Grundsätzlich setzen wir Cookies der folgenden Kategorien ein:</p>

            <table className={tableClass}>
              <thead>
                <tr>
                  <th className={thClass}>Kategorie</th>
                  <th className={thClass}>Beschreibung</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={tdClass}>Technisch erforderlich</td>
                  <td className={tdClass}>Diese Cookies sind notwendig, damit die Website funktioniert. Ohne diese Cookies würden Serviceleistungen, wie z.B. der Fahrzeugkonfigurator nicht funktionieren.</td>
                </tr>
                <tr>
                  <td className={tdClass}>Analyse &amp; Statistik</td>
                  <td className={tdClass}>Diese Webtechnologien (u.a. Cookies) ermöglichen es einer Webseite, bereits getätigte Angaben (wie zum Beispiel Benutzernamen, Einstellungen, Spracheinstellungen) zu speichern und dem Nutzer verbesserte, persönlichere Funktionen anzubieten. Um das Verhalten unserer Webseitenbesucher weiter zu analysieren, sammeln z.B. Cookies Informationen, wie die Anzahl der Besuche, die durchschnittliche Verweilzeit oder die aufgerufenen Seiten.</td>
                </tr>
                <tr>
                  <td className={tdClass}>Marketing</td>
                  <td className={tdClass}>Diese Webtechnologien werden genutzt, um gezielter für den Nutzer relevante und an seine Interessen angepasste Inhalte anzubieten. Sie werden außerdem dazu verwendet, die Erscheinungshäufigkeit einer Anzeige zu begrenzen und die Effektivität von Werbekampagnen zu messen und zu steuern.</td>
                </tr>
              </tbody>
            </table>

            <p>Cookies können für einen längeren Zeitraum oder temporär auf Ihrem Gerät gespeichert werden.</p>
            <p className="mt-3">Sogenannte permanente Cookies werden für einen bestimmten Zeitraum bis zu einem festgelegten Ablaufdatum des Cookies (oder bis Sie diesen vorher löschen) auf Ihrem Endgerät gespeichert. Damit werden z.B. Spracheinstellungen gespeichert, so dass Sie diese nicht erneut für unsere Webseite vornehmen müssen.</p>
            <p className="mt-3">Durch einen sogenannten Session Cookie (Sitzungs-Cookie) wird temporär eine Sitzungs-Kennung gespeichert, während Sie auf unserer Webseite aktiv sind. Dies verhindert z.B. bei einem Seitenwechsel, dass Sie sich erneut anmelden müssen. Session-Cookies werden bei der Abmeldung gelöscht bzw. verlieren ihre Gültigkeit, sobald Ihre Sitzung abgelaufen ist.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">First Party Cookie</h3>
            <p>Unter einem First Party Cookie versteht man ein Cookie, das von uns als Verantwortlicher oder von unseren Auftragsverarbeitern gesetzt wird. Die AUDI Gesellschaft, die die Webseite betreibt (siehe Impressum), ist verantwortlich für die Datenverarbeitung. Diese AUDI Gesellschaft verarbeitet die von den First Party Cookies gesammelten Daten zu eigenen Zwecken, unabhängig davon, ob sie das Cookie selbst programmiert hat oder das Cookie einer anderen juristischen Person einsetzt.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">Third Party Cookie</h3>
            <p>Unter einem Third Party Cookie versteht man ein Cookie, das von einem Dritten gesetzt wird, der nicht mit der AUDI Gesellschaft, die die gerade von Ihnen besuchte Webseite betreibt, identisch ist, zum Beispiel von unseren Dienstleistern. Third Party Cookies stammen von verschiedenen Domains Dritter, die die Cookies flexibel verwenden können, um Nutzerverhalten auf unserer Webseite und auf Webseiten von Dritten außerhalb des Angebots des Drittanbieters zu verfolgen (insb. für benutzerspezifische Werbung).</p>

            {/* Technisch erforderlich */}
            <h3 className="font-semibold text-gray-800 mt-8 mb-2">(1) Technisch erforderlich</h3>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>1st/3rd</th>
                    <th className={thClass}>Zweck</th>
                    <th className={thClass}>Art</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ADRUM", "1st", "AppDynamics Real User Monitoring – anonymisiertes Monitoring um u.a. Ladezeiten und Ladefehler zu identifizieren", "Sitzungscookie"],
                    ["ADRUM_BTa", "1st", "AppDynamics Real User Monitoring", "Persistent (1 Tag)"],
                    ["ADRUM_BT1", "1st", "AppDynamics Real User Monitoring", "Persistent (1 Tag)"],
                    ["LBCOOKIE", "1st", "Lastverteilung über den Load Balancer", "Sitzungscookie"],
                    ["JSESSIONID", "1st", "Anonyme Session ID über den Server", "Sitzungscookie"],
                    ["AUDI_ENSIGHTEN_PRIVACY_Do_Not_Track", "1st", "Speichert ob 'Do Not Track' aktiviert ist", "Persistent (1 Jahr)"],
                    ["AUDI_ENSIGHTEN_PRIVACY_MODAL_VIEWED", "1st", "Speichert ob mit dem Consent Modal interagiert wurde", "Persistent (1 Jahr)"],
                    ["AUDI_ENSIGHTEN_PRIVACY_Functional", "1st", "Einstellung zu Functional Cookies", "Persistent (1 Jahr)"],
                    ["AUDI_ENSIGHTEN_PRIVACY_Performance", "1st", "Einstellung zu Performance Cookies", "Persistent (1 Jahr)"],
                    ["AUDI_ENSIGHTEN_PRIVACY_Marketing", "1st", "Einstellung zu Marketing Cookies", "Persistent (1 Jahr)"],
                    ["AUDI_ENSIGHTEN_PRIVACY_External_Content", "1st", "Einstellung zu externen Inhalten (z.B. Google Maps)", "Persistent (1 Jahr)"],
                    ["AUDI_ENSIGHTEN_PRIVACY_MODAL_LOADED", "1st", "Speichert ob das Consent Modal dargestellt wurde", "Persistent (1 Jahr)"],
                    ["JSESSIONID", "3rd", "Anonyme Session ID über den Server", "Sitzungscookie"],
                    ["LBCOOKIE", "3rd", "Lastverteilung über den Load Balancer", "Sitzungscookie"],
                    ["AKA_A2", "3rd", "Akamai – Adaptive Acceleration Feature", "Persistent (2 Jahre)"],
                    ["i18nextLng", "1st", "Speicherung der Spracheinstellung", "Persistent"],
                    ["anonymous_session_id", "1st", "Token zur Identifikation der anonymen Benutzersitzung", "Persistent"],
                    ["anonymous_session_refresh_token", "1st", "Token zum Aktualisieren der anonymous_session_id", "Persistent"],
                    ["oneshop.tenant.context", "1st", "Identifiziert den aktuellen Tenant/Anbieter", "Persistent"],
                    ["oneshop.product.vin", "1st", "Speichert letzte gültige Fahrzeugidentifikationsnummer", "Persistent"],
                    ["oneshop.products.activeFacets", "1st", "Zuletzt angewandte Filter auf der Produktlistenseite", "Sitzungscookie"],
                    ["oneshop.product.isFromPlp", "1st", "Zeigt ob Nutzer von Produktlistenseite kam", "Sitzungscookie"],
                    ["oneshop.product.recommendedConfiguration", "1st", "Spezielle Deeplink-Parameter", "Sitzungscookie"],
                    ["wlfeRefreshSessionId", "1st", "Refresh-Token für e2e Leasing-Portal", "Persistent (5 Min.)"],
                    ["wlfeRestoreTenant", "1st", "Tenant für e2e Leasing-Portal", "Persistent (5 Min.)"],
                    ["wlfeDoLogin", "1st", "Login-Status für e2e Leasing-Portal", "Persistent (5 Min.)"],
                    ["redirectUrl", "1st", "Speichert URL vor Anmeldung", "Sitzungscookie"],
                    ["userToken", "1st", "Authentifizierungstoken des angemeldeten Benutzers", "Sitzungscookie"],
                    ["_acq_visit", "1st", "Wiedererkennung des Besuchers (Audi Online Beratung)", "Permanent (6 Monate)"],
                    ["_acq_id_contact_local", "1st", "Wiedererkennung des Besuchers (Auto message pop up)", "Permanent (6 Monate)"],
                    ["psyma_participation", "1st", "Auswahlwahrscheinlichkeit und Vermeidung von Mehrfacheinladungen", "Persistent (30 Tage)"],
                    ["mod_auth_openidc_session_live", "1st", "Session token des Token proxy", "22h"],
                    ["Nonce", "1st", "Validates ID tokens", "Session"],
                    ["access_token", "1st", "Access token zum Authentifizieren", "Persistent (5 Min.)"],
                    ["referer", "1st", "Saves referrer from initial call", "Session"],
                    ["myaudi-logout-redirect", "1st", "Saves redirect URL for later use", "0s"],
                    ["mod_auth_openidc_state_", "1st", "OpenID Connect authentication handling", "Session"],
                  ].map(([name, party, purpose, type], i) => (
                    <tr key={i}>
                      <td className={tdClass + " font-mono text-xs"}>{name}</td>
                      <td className={tdClass}>{party}</td>
                      <td className={tdClass}>{purpose}</td>
                      <td className={tdClass}>{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Analyse und Statistik */}
            <h3 className="font-semibold text-gray-800 mt-8 mb-2">(2) Analyse und Statistik</h3>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>1st/3rd</th>
                    <th className={thClass}>Zweck</th>
                    <th className={thClass}>Art</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["ac_hid", "1st", "Zufällige ID zur Wiedererkennung im Konfigurator", "unbefristet"],
                    ["lvc_{market}", "1st", "Speichert zuletzt besuchte Fahrzeuge", "Persistent (7 Tage)"],
                    ["notepad_{market}", "1st", "Favoriten/Merkzettel", "Persistent (30 Tage)"],
                    ["vtp.results viewType", "1st", "Typ der Ergebnisliste (Grid/List View)", "Persistent (1 Jahr)"],
                    ["vtp.mfccampaign.{market}", "1st", "Marketing-Kampagnen beim Börseneinsprung", "Persistent (7 Tage)"],
                    ["cbs_{market}_[#]", "1st", "Gespeicherte Suche (Suchparameter)", "Persistent (1 Jahr)"],
                    ["myaudi", "1st", "Token für den myAudi login", "Sitzungscookie"],
                    ["vtp.aoz.{carId}", "1st", "Ausgewählte AOZ items/Pakete", "Persistent (1 Jahr)"],
                    ["_tag_frontend_{account-id}_vid", "1st", "Wiedererkennung des Besuchers (Session Management)", "Permanent (6 Monate)"],
                    ["_tgclose_{account_ID}_c", "1st", "Wiedererkennung des Besuchers (Auto message pop up)", "Permanent (6 Monate)"],
                    ["adb_mcmid", "1st", "Adobe Marketing Cloud Visitor ID", "Sitzungscookie"],
                    ["sendtoafriend", "1st", "Suchparameter für Send-to-a-friend", "Persistent (30 Tage)"],
                    ["aam_uuid", "1st", "Informationen über Websitenutzung", "Persistent (1 Monat)"],
                    ["s_gnr", "1st", "Neuer oder wiederkehrender Besucher", "Persistent (1 Monat)"],
                    ["s_invisit", "1st", "Anzahl der Website-Besuche", "Persistent (30 Min.)"],
                    ["s_lv", "1st", "Vergangene Zeit zwischen wiederholtem Besuch", "Persistent (3 Jahre)"],
                    ["s_lv_s", "1st", "Besucher unterscheiden, statistische Daten", "Persistent (30 Min.)"],
                    ["s_ppv", "1st", "Anteil der gesehenen Seite", "Sitzungscookie"],
                    ["s_vnum", "1st", "Anzahl der Website-Besuche (Adobe Plugin)", "Persistent (1 Monat)"],
                    ["A3deviceForRedirect", "1st", "User-Test Steuerung", "Persistent (7 Tage)"],
                    ["dpm", "3rd", "Anonyme ID (Adobe Audience Manager)", "Persistent (180 Tage)"],
                    ["id", "3rd", "Google DoubleClick/Floodlight – Aktionen nach Anzeigenklick", "Sitzungscookie"],
                    ["Usabilla", "3rd", "Aggregation von User-Feedback", "–"],
                    ["_ens_lc", "1st", "Besuchszahlen, Klickverhalten", "Persistent (30 Min.)"],
                    ["_ens_perf", "1st", "Optimierung der Webseite", "Persistent (30 Min.)"],
                    ["_ens_prev", "1st", "Besuchszahlen, Klickverhalten", "Sitzungscookie"],
                    ["_ens_sid", "1st", "Optimierung der Webseite", "Persistent (30 Min.)"],
                    ["_ens_vn", "1st", "Zuvor besuchte Webseite, Anzahl Besuche", "Persistent (1 Jahr)"],
                    ["AMCV_*", "1st", "Wiedererkennung des Besuchers", "Persistent (2 Jahre)"],
                    ["AMCVS_*", "1st", "Wiedererkennung des Besuchers", "Sitzungscookie"],
                    ["s_cc", "1st", "Einstellungen des Nutzers (Sprache etc.)", "Sitzungscookie"],
                    ["s_ecid", "3rd", "Wiedererkennung des Besuchers", "Persistent (2 Jahre)"],
                    ["dcdata", "1st", "Optimierung der Webseite", "Persistent (24 Monate)"],
                    ["s_sq", "1st", "Optimierung der Webseite", "Sitzungscookie"],
                    ["s_fid", "1st", "Wiedererkennung des Besuchers", "Persistent (2 Jahre)"],
                    ["s_vi", "1st", "Wiedererkennung des Besuchers", "Persistent (2 Jahre)"],
                    ["demdex", "3rd", "Wiedererkennung des Besuchers", "Persistent (180 Tage)"],
                    ["at_check", "1st", "Prüft ob Browser Cookies erlaubt", "Session"],
                    ["mbox", "1st", "Eindeutige ID pro Browser und Session", "2 Jahre"],
                    ["mboxEdgeCluster", "1st", "Adobe Target Edge Server Identifikation", "Session"],
                  ].map(([name, party, purpose, type], i) => (
                    <tr key={i}>
                      <td className={tdClass + " font-mono text-xs"}>{name}</td>
                      <td className={tdClass}>{party}</td>
                      <td className={tdClass}>{purpose}</td>
                      <td className={tdClass}>{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Marketing */}
            <h3 className="font-semibold text-gray-800 mt-8 mb-2">(3) Marketing</h3>
            <div className="overflow-x-auto">
              <table className={tableClass}>
                <thead>
                  <tr>
                    <th className={thClass}>Name</th>
                    <th className={thClass}>1st/3rd</th>
                    <th className={thClass}>Zweck</th>
                    <th className={thClass}>Art</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["_ens_lc", "1st", "Besuchszahlen, Klickverhalten, Targeting, Nutzerprofilen", "Persistent (30 Min.)"],
                    ["_ens_perf", "1st", "Optimierung, Targeting, Nutzerprofilen", "Persistent (30 Min.)"],
                    ["_ens_prev", "1st", "Besuchszahlen, Targeting, Authentifizierungsstatus", "Sitzungscookie"],
                    ["_ens_sid", "1st", "Optimierung, Targeting, Nutzerprofilen", "Persistent (30 Min.)"],
                    ["_ens_vn", "1st", "Zuvor besuchte Webseite, Targeting", "Persistent (1 Jahr)"],
                    ["AMCV_*", "1st", "Wiedererkennung, Targeting, Authentifizierungsstatus", "Persistent (2 Jahre)"],
                    ["AMCVS_*", "1st", "Wiedererkennung, Targeting", "Sitzungscookie"],
                    ["s_cc", "1st", "Einstellungen, Targeting", "Sitzungscookie"],
                    ["s_ecid", "3rd", "Wiedererkennung, Targeting, Authentifizierungsstatus", "Persistent (2 Jahre)"],
                    ["dcdata", "1st", "Optimierung, Targeting", "Persistent (24 Monate)"],
                    ["s_sq", "1st", "Optimierung, Targeting", "Sitzungscookie"],
                    ["s_fid", "1st", "Wiedererkennung, Targeting, Authentifizierungsstatus", "Persistent (2 Jahre)"],
                    ["s_vi", "1st", "Wiedererkennung, Targeting, Authentifizierungsstatus", "Persistent (2 Jahre)"],
                    ["demdex", "3rd", "Wiedererkennung, Targeting", "Persistent (180 Tage)"],
                    ["IDE", "3rd", "Google Werbeanzeigen auf Drittanbieterseiten", "Persistent (13 Monate)"],
                    ["_fbp", "3rd", "Meta – Besucherinteraktionen nach Anzeigenklick", "Persistent (<2 Jahre)"],
                    ["smartSignals2UiD", "1st", "Eindeutige ID zur Wiedererkennung über Sitzungen", "Permanent"],
                    ["smartSignals2UiD", "3rd", "Wiedererkennung über verschiedene Audi Domains", "Permanent"],
                    ["AAT", "3rd", "Amazon – Wiedererkennung, Targeting", "Persistent (13 Monate)"],
                    ["MUID", "3rd", "Microsoft (Bing) – Browser-GUID", "1 Jahr"],
                    ["_uetmsclkid", "3rd", "Microsoft Klick-ID", "Session"],
                    ["_uetsid", "3rd", "Bing – Sitzungs-ID", "1 Tag"],
                    ["_uetvid", "3rd", "Bing – anonymisierte Besucher-ID", "13 Monate"],
                    ["BizographicsOptOut", "3rd", "LinkedIn – Opt-out gezielte Werbung", "10 Jahre"],
                    ["UserMatchHistory", "3rd", "LinkedIn Insight-Tag", "30 Tage"],
                    ["U", "3rd", "LinkedIn – Browserkennung (außerhalb EU/EWR)", "~3 Monate"],
                    ["li_sugr", "3rd", "LinkedIn – probabilistischer Identitätsabgleich", "~3 Monate"],
                    ["bscookie", "3rd", "LinkedIn – Zwei-Faktor-Authentifizierung", "2 Jahre"],
                    ["bcookie", "3rd", "LinkedIn – Browser-Identifikation", "2 Jahre"],
                    ["li_fat_id", "3rd", "LinkedIn – Nutzer-ID bei Anzeigenklick", "30 Tage"],
                    ["Google Floodlight", "3rd", "Google DoubleClick/Floodlight – Conversion Tracking", "Sitzungscookie (30-90 Tage)"],
                  ].map(([name, party, purpose, type], i) => (
                    <tr key={i}>
                      <td className={tdClass + " font-mono text-xs"}>{name}</td>
                      <td className={tdClass}>{party}</td>
                      <td className={tdClass}>{purpose}</td>
                      <td className={tdClass}>{type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Services von Dritten */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">4. Services von Dritten</h2>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">a. Ensighten Privacy Manager</h3>
            <p>Wir nutzen den Ensighten Privacy Manager, der uns dabei hilft, die auf der Webseite benutzten Cookies zu verwalten. Der Ensighten Privacy Manager verwendet Cookies, um Information darüber zu speichern, ob und wenn ja, für welche Kategorien von Cookies die Benutzer ihre Einwilligung erteilt haben.</p>
            <p className="mt-2">In diesem Zusammenhang werden folgende Daten verarbeitet: IP-Adresse, User Agent, URL, Referrer URL, Zeitstempel, Liste der Server Calls, Datenschutzrechtlich relevante Cookies, Datenschutzrechtlich relevante Ereignisse.</p>
            <p className="mt-2">Die Rechtsgrundlage für eine solche Verarbeitung personenbezogener Daten ist unser berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f) DSGVO.</p>
            <p className="mt-2">Der Ensighten Privacy Manager wird bereitgestellt von unserem Dienstleister Tagman Ltd., 2 Riding House Street, London W1W 7FA, Vereinigtes Königreich, der als unser Auftragsverarbeiter eingesetzt wird.</p>
            <p className="mt-2">Die vom Ensighten Privacy Manager gespeicherten Daten werden gelöscht, wenn die Daten für unsere oben genannten Zwecke nicht mehr gebraucht werden. Das ist nach drei Jahren der Fall.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">b. Audi Online Beratung</h3>
            <p>Wir nutzen die Audi Online Beratung, um Ihnen eine optimale Beratung im Rahmen Ihres Besuches auf unseren Webseiten sowie den Webseiten unserer Audi Partner anbieten zu können. Die Audi Online Beratung verwendet Cookies, um Nutzer wiederzuerkennen.</p>
            <p className="mt-2">In diesem Zusammenhang werden folgende Daten verarbeitet: Eindeutige Nutzer-ID, Status ob der Nutzer die automatische Pop Up Message schon geschlossen hat oder nicht.</p>
            <p className="mt-2">Die Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a) DSGVO. Die Daten werden nach 30 Minuten gelöscht.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">c. Adobe Analytics</h3>
            <p>Wir nutzen das Analysetool Adobe Analytics auf unserer Webseite. Adobe Analytics wird von Adobe Systems Software Ireland Limited, 4-6 Riverwalk, Citywest Business Campus, Dublin 24, Irland, bereitgestellt. Adobe Analytics nutzt Cookies, um Interaktionen von Nutzern der Webseite aufzuzeichnen und systematisch auszuwerten.</p>
            <p className="mt-2">In diesem Zusammenhang werden folgende Daten gesammelt: IP-Adresse des Nutzers (anonymisiert), eindeutige Nutzer-ID, eindeutige Login ID, Klickverhalten, aufgerufene Unterseiten, Browser Typ, URL, Bildschirmauflösung, Zeitstempel.</p>
            <p className="mt-2">Die IP-Adresse wird vor der Speicherung anonymisiert. Die Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a) DSGVO. Die Daten werden nach 24 Monaten gelöscht.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">d. Adobe Target</h3>
            <p>Wir nutzen das Test- und Personalisierungstool Adobe Target, um Ihr Nutzererlebnis zu verbessern und für Sie relevantere Inhalte auf dieser Webseite anzuzeigen. Adobe Target wird von Adobe Systems Software Ireland Limited bereitgestellt.</p>
            <p className="mt-2">Die Rechtsgrundlage ist Ihre Einwilligung gemäß Art. 6 Abs. 1 lit. a) DSGVO. Die Daten werden nach 90 Tagen ohne Webseiteninteraktion gelöscht.</p>

            <h3 className="font-semibold text-gray-800 mt-6 mb-2">e. User Tracking und nutzungsbasierte Online-Werbung</h3>
            <p>Informationen hierzu finden Sie in unserem Datenschutzhinweis unter 2.8</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Empfänger Ihrer personenbezogenen Daten</h2>
            <p>Personenbezogene Daten, die durch Nutzung von Serviceleistungen Dritter gesammelt und gespeichert werden, werden den Entwicklern, Angestellten und Beratern des Drittanbieters zur Verfügung gestellt. Angemessene Sicherheits- und Vertraulichkeitsmaßnahmen sind jederzeit gewährleistet.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Grenzüberschreitende Übermittlung von personenbezogenen Daten</h2>
            <p>Ihre personenbezogenen Daten können außerhalb Ihres Wohnsitzstaates gespeichert werden und als solche sind Ihre personenbezogenen Daten den Strafverfolgungs- und/oder Aufsichtsbehörden gemäß den geltenden Gesetzen dieser Länder zugänglich. Sofern gesetzlich vorgeschrieben, werden wir vorher Ihre ausdrückliche Einwilligung für eine solche Übermittlung einholen.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Kontaktieren Sie uns</h2>
            <p>Unser Datenschutzbeauftragter ist Ihre Kontaktperson für alle datenschutzrechtlichen Angelegenheiten und ist verfügbar, um Sie bei der Ausübung Ihrer Rechte zu unterstützen. Bitte richten Sie Ihre Einsendungen an:</p>
            <p className="mt-2">AUDI AG Datenschutzbeauftragter, Auto-Union-Straße 1, 85045 Ingolstadt, Deutschland</p>
            <p className="mt-1">datenschutz@audi.de</p>
          </div>

          <p className="mt-8 text-xs text-gray-400">Cookie Richtlinie datierend 01/2023</p>
          <p className="text-xs text-gray-400">*First-Party Cookies: First-Party Cookies werden von Browsern nicht domainübergreifend zugänglich gemacht.</p>
        </div>
      </div>
    </div>
  );
}
