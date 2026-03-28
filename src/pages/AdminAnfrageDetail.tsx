import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Anfrage {
  id: string;
  created_at: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  nachricht: string;
  fahrzeug_id: string;
  fahrzeug_name: string;
  fahrzeug_preis: number;
  auftragsnummer: string | null;
  verkaeufer_id: string;
  verkaeufer_name: string;
  branding_name: string;
  status: string;
  notizen: string | null;
}

export default function AdminAnfrageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anfrage, setAnfrage] = useState<Anfrage | null>(null);
  const [notizen, setNotizen] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Extra data
  const [fahrzeug, setFahrzeug] = useState<any>(null);
  const [verkaeufer, setVerkaeufer] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("anfragen")
        .select("*")
        .eq("id", id)
        .single();
      if (data) {
        setAnfrage(data);
        setNotizen(data.notizen || "");

        // Load vehicle and seller details
        const [fzRes, vkRes] = await Promise.all([
          supabase.from("fahrzeuge").select("*").eq("id", data.fahrzeug_id).single(),
          supabase.from("verkaeufer").select("*").eq("id", data.verkaeufer_id).single(),
        ]);
        if (fzRes.data) setFahrzeug(fzRes.data);
        if (vkRes.data) setVerkaeufer(vkRes.data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const saveNotizen = async () => {
    if (!id) return;
    setSaving(true);
    await supabase.from("anfragen").update({ notizen }).eq("id", id);
    toast({ title: "Notizen gespeichert" });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!anfrage) {
    return <p className="text-gray-500">Anfrage nicht gefunden.</p>;
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0 }).format(p);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const InfoRow = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "–"}</span>
    </div>
  );

  return (
    <div className="max-w-4xl">
      <button
        onClick={() => navigate("/admin/anfragen")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zu Anfragen
      </button>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Anfrage von {anfrage.vorname} {anfrage.nachname}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Anfrage-Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontaktdaten</h3>
          <InfoRow label="Name" value={`${anfrage.vorname} ${anfrage.nachname}`} />
          <InfoRow label="E-Mail" value={anfrage.email} />
          <InfoRow label="Telefon" value={anfrage.telefon} />
          <InfoRow label="Datum" value={formatDate(anfrage.created_at)} />
          <InfoRow label="Status" value={anfrage.status} />

          <h4 className="text-sm font-semibold text-gray-700 mt-6 mb-2">Nachricht</h4>
          <p className="text-sm text-gray-600 bg-gray-50 rounded p-3 whitespace-pre-wrap">{anfrage.nachricht}</p>
        </div>

        {/* Fahrzeug-Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fahrzeug</h3>
          <InfoRow label="Fahrzeug" value={anfrage.fahrzeug_name} />
          <InfoRow label="Preis" value={`${formatPrice(anfrage.fahrzeug_preis)} €`} />
          <InfoRow label="Auftragsnummer" value={anfrage.auftragsnummer} />
          {fahrzeug && (
            <>
              <InfoRow label="Kilometerstand" value={fahrzeug.km_stand ? `${new Intl.NumberFormat("de-DE").format(fahrzeug.km_stand)} km` : null} />
              <InfoRow label="Erstzulassung" value={fahrzeug.erstzulassung} />
              <InfoRow label="Kraftstoff" value={fahrzeug.kraftstoff} />
              <InfoRow label="Getriebe" value={fahrzeug.getriebe} />
              <InfoRow label="Leistung" value={fahrzeug.kw && fahrzeug.ps ? `${fahrzeug.kw} kW / ${fahrzeug.ps} PS` : null} />
              <InfoRow label="Farbe" value={fahrzeug.farbe} />
            </>
          )}

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Verkäufer</h3>
          <InfoRow label="Name" value={anfrage.verkaeufer_name} />
          <InfoRow label="Branding" value={anfrage.branding_name} />
          {verkaeufer && (
            <>
              <InfoRow label="E-Mail" value={verkaeufer.email} />
              <InfoRow label="Telefon" value={verkaeufer.telefon} />
            </>
          )}
        </div>
      </div>

      {/* Notizen */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interne Notizen</h3>
        <Textarea
          value={notizen}
          onChange={(e) => setNotizen(e.target.value)}
          placeholder="Notizen zur Anfrage hinzufügen..."
          className="min-h-[120px] mb-4"
        />
        <Button onClick={saveNotizen} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Speichern..." : "Notizen speichern"}
        </Button>
      </div>
    </div>
  );
}
