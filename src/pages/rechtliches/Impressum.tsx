import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
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

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Impressum</h1>

        <div className="text-sm text-gray-700 leading-relaxed space-y-4">
          <p className="font-semibold text-base">AUDI AG</p>

          <div>
            <p>Auto-Union-Str. 1</p>
            <p>85057 Ingolstadt</p>
            <p>Deutschland</p>
          </div>

          <div>
            <p><span className="font-semibold">Telefon:</span> +49 (0)841 89-0</p>
            <p><span className="font-semibold">Telefax:</span> +49 (0)841 89-32524</p>
          </div>

          <p><span className="font-semibold">E-Mail:</span> impressum@audi.de</p>

          <p>Die AUDI AG ist eine Aktiengesellschaft deutschen Rechts mit Hauptsitz in Ingolstadt.</p>

          <p><span className="font-semibold">Vorsitzender des Aufsichtsrats:</span> Manfred Döss</p>

          <div>
            <p className="font-semibold mb-2">Vorstand:</p>
            <ul className="list-none space-y-1">
              <li>Gernot Döllner (Vorsitzender)</li>
              <li>Dieter Dehoorne</li>
              <li>Rouven Mohr</li>
              <li>Jürgen Rittersberger</li>
              <li>Javier Ros Hernández</li>
              <li>Marco Schubert</li>
              <li>Gerd Walker</li>
            </ul>
          </div>

          <p>Die AUDI AG ist im Handelsregister des Amtsgerichts Ingolstadt unter der Nummer HR B 1 eingetragen.</p>

          <p>Die Umsatzsteueridentifikationsnummer der AUDI AG ist DE811115368.</p>

          <p>Die AUDI AG ist zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder bereit noch dazu verpflichtet.</p>
        </div>
      </div>
    </div>
  );
}
