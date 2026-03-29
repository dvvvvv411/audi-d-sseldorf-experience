import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Save, User, Mail, Phone, Calendar,
  Car, Fuel, Gauge, Palette, CreditCard, Quote,
  StickyNote, MapPin, Cog, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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

  const statusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "neu": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "in bearbeitung": return "bg-amber-100 text-amber-800 border-amber-200";
      case "abgeschlossen": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const IconBadge = ({ icon: Icon, color }: { icon: any; color: string }) => (
    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
  );

  const DetailRow = ({ icon, iconColor, label, value, href }: { icon: any; iconColor: string; label: string; value: string | null | undefined; href?: string }) => (
    <div className="flex items-center gap-3 py-2.5">
      <IconBadge icon={icon} color={iconColor} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        {href && value ? (
          <a href={href} className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">{value}</a>
        ) : (
          <p className="text-sm font-medium text-gray-900">{value || "–"}</p>
        )}
      </div>
    </div>
  );

  const initials = anfrage.verkaeufer_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-5xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/admin/anfragen")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zu Anfragen
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-700">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {anfrage.vorname} {anfrage.nachname}
            </h2>
            <p className="text-sm text-gray-500">{formatDate(anfrage.created_at)}</p>
          </div>
        </div>
        <Badge className={`text-sm px-3 py-1 border ${statusColor(anfrage.status)}`}>
          {anfrage.status}
        </Badge>
      </div>

      {/* Row 1: Kontakt + Nachricht */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Kontaktdaten */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-blue-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Kontaktdaten
            </h3>
            <div className="space-y-1">
              <DetailRow icon={User} iconColor="bg-blue-50 text-blue-600" label="Name" value={`${anfrage.vorname} ${anfrage.nachname}`} />
              <DetailRow icon={Mail} iconColor="bg-blue-50 text-blue-600" label="E-Mail" value={anfrage.email} href={`mailto:${anfrage.email}`} />
              <DetailRow icon={Phone} iconColor="bg-blue-50 text-blue-600" label="Telefon" value={anfrage.telefon} href={`tel:${anfrage.telefon}`} />
              <DetailRow icon={Calendar} iconColor="bg-blue-50 text-blue-600" label="Eingegangen" value={formatDate(anfrage.created_at)} />
            </div>
          </div>
        </div>

        {/* Nachricht */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-amber-500" />
          <div className="p-6 flex flex-col h-full">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Quote className="w-4 h-4 text-amber-500" />
              Nachricht
            </h3>
            <div className="flex-1 bg-amber-50 rounded-lg p-4 border border-amber-100">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{anfrage.nachricht}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Fahrzeug + Verkäufer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Fahrzeug */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-emerald-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Car className="w-4 h-4 text-emerald-500" />
              Fahrzeug
            </h3>

            {/* Preis prominent */}
            <div className="bg-emerald-50 rounded-lg p-4 mb-4 border border-emerald-100 text-center">
              <p className="text-xs text-emerald-600 uppercase tracking-wide mb-1">Preis</p>
              <p className="text-2xl font-bold text-emerald-700">{formatPrice(anfrage.fahrzeug_preis)} €</p>
            </div>

            <DetailRow icon={Car} iconColor="bg-emerald-50 text-emerald-600" label="Fahrzeug" value={anfrage.fahrzeug_name} />
            <DetailRow icon={CreditCard} iconColor="bg-emerald-50 text-emerald-600" label="Auftragsnummer" value={anfrage.auftragsnummer} />

            {fahrzeug && (
              <div className="grid grid-cols-2 gap-x-4 mt-2">
                <DetailRow icon={Gauge} iconColor="bg-emerald-50 text-emerald-600" label="KM-Stand" value={fahrzeug.km_stand ? `${new Intl.NumberFormat("de-DE").format(fahrzeug.km_stand)} km` : null} />
                <DetailRow icon={Calendar} iconColor="bg-emerald-50 text-emerald-600" label="Erstzulassung" value={fahrzeug.erstzulassung} />
                <DetailRow icon={Fuel} iconColor="bg-emerald-50 text-emerald-600" label="Kraftstoff" value={fahrzeug.kraftstoff} />
                <DetailRow icon={Cog} iconColor="bg-emerald-50 text-emerald-600" label="Getriebe" value={fahrzeug.getriebe} />
                <DetailRow icon={Zap} iconColor="bg-emerald-50 text-emerald-600" label="Leistung" value={fahrzeug.kw && fahrzeug.ps ? `${fahrzeug.kw} kW / ${fahrzeug.ps} PS` : null} />
                <DetailRow icon={Palette} iconColor="bg-emerald-50 text-emerald-600" label="Farbe" value={fahrzeug.farbe} />
              </div>
            )}
          </div>
        </div>

        {/* Verkäufer */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-purple-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              Verkäufer
            </h3>

            {/* Avatar + Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{anfrage.verkaeufer_name}</p>
                <p className="text-xs text-gray-500">{anfrage.branding_name}</p>
              </div>
            </div>

            {verkaeufer && (
              <div className="space-y-1">
                <DetailRow icon={Mail} iconColor="bg-purple-50 text-purple-600" label="E-Mail" value={verkaeufer.email} href={`mailto:${verkaeufer.email}`} />
                <DetailRow icon={Phone} iconColor="bg-purple-50 text-purple-600" label="Telefon" value={verkaeufer.telefon} href={`tel:${verkaeufer.telefon}`} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notizen */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-1 bg-gray-400" />
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-gray-500" />
            Interne Notizen
          </h3>
          <Textarea
            value={notizen}
            onChange={(e) => setNotizen(e.target.value)}
            placeholder="Notizen zur Anfrage hinzufügen..."
            className="min-h-[120px] mb-4 bg-white border-gray-300 text-gray-900"
          />
          <Button onClick={saveNotizen} disabled={saving} className="bg-gray-900 text-white hover:bg-gray-800">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Speichern..." : "Notizen speichern"}
          </Button>
        </div>
      </div>
    </div>
  );
}
