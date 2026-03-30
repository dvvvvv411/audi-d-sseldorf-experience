import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Save, User, Mail, Phone, Calendar,
  Car, Fuel, Gauge, Palette, CreditCard, Quote,
  StickyNote, MapPin, Cog, Zap, Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const statusOptions = [
  "Neu", "In Bearbeitung", "Möchte Daten", "Möchte Rechnung", "Rechnung versendet", "Bezahlt"
];

const statusColors: Record<string, string> = {
  "Neu": "bg-gray-100 text-gray-800 border-gray-200",
  "NEU": "bg-gray-100 text-gray-800 border-gray-200",
  "In Bearbeitung": "bg-blue-100 text-blue-800 border-blue-200",
  "Möchte Daten": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Möchte Rechnung": "bg-orange-100 text-orange-800 border-orange-200",
  "Rechnung versendet": "bg-purple-100 text-purple-800 border-purple-200",
  "Bezahlt": "bg-green-100 text-green-800 border-green-200",
};

const displayStatus = (s: string) => s === "NEU" ? "Neu" : s;

export default function AdminAnfrageDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anfrage, setAnfrage] = useState<Anfrage | null>(null);
  const [notizen, setNotizen] = useState<{ id: string; text: string; created_at: string }[]>([]);
  const [neueNotiz, setNeueNotiz] = useState("");
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
        const [fzRes, vkRes, notizenRes] = await Promise.all([
          supabase.from("fahrzeuge").select("*").eq("id", data.fahrzeug_id).single(),
          supabase.from("verkaeufer").select("*").eq("id", data.verkaeufer_id).single(),
          supabase.from("anfrage_notizen").select("*").eq("anfrage_id", data.id).order("created_at", { ascending: true }),
        ]);
        if (fzRes.data) setFahrzeug(fzRes.data);
        if (vkRes.data) setVerkaeufer(vkRes.data);
        if (notizenRes.data) setNotizen(notizenRes.data);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!anfrage || !id) return;
    const oldStatus = anfrage.status;
    setAnfrage({ ...anfrage, status: newStatus });
    const { error } = await supabase.from("anfragen").update({ status: newStatus }).eq("id", id);
    if (error) {
      setAnfrage({ ...anfrage, status: oldStatus });
      toast({ title: "Fehler", description: "Status konnte nicht geändert werden.", variant: "destructive" });
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("aktivitaets_log").insert({
        user_email: user.email || "",
        aktion: "status_geaendert",
        anfrage_id: id,
        details: `${anfrage.vorname} ${anfrage.nachname}: ${displayStatus(oldStatus)} → ${newStatus}`,
      });
    }
    toast({ title: "Status geändert", description: `${displayStatus(oldStatus)} → ${newStatus}` });
  };

  const addNotiz = async () => {
    if (!id || !neueNotiz.trim() || !anfrage) return;
    setSaving(true);
    const { data } = await supabase
      .from("anfrage_notizen")
      .insert({ anfrage_id: id, text: neueNotiz.trim() } as any)
      .select()
      .single();
    if (data) setNotizen((prev) => [...prev, data]);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("aktivitaets_log").insert({
        user_email: user.email || "",
        aktion: "notiz_hinzugefuegt",
        anfrage_id: id,
        details: `${anfrage.vorname} ${anfrage.nachname}: ${neueNotiz.trim()}`,
      });
    }

    setNeueNotiz("");
    toast({ title: "Notiz hinzugefügt" });
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
        <Select value={displayStatus(anfrage.status)} onValueChange={handleStatusChange}>
          <SelectTrigger className={`w-auto min-w-[160px] border text-sm font-medium ${statusColors[displayStatus(anfrage.status)] || statusColors[anfrage.status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      {/* Row 2: Fahrzeug + Notizen */}
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
            <DetailRow icon={Hash} iconColor="bg-emerald-50 text-emerald-600" label="Fahrgestellnummer" value={fahrzeug?.fahrgestellnummer} />

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

        {/* Notizen */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-gray-400" />
          <div className="p-6 flex flex-col h-full">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <StickyNote className="w-4 h-4 text-gray-500" />
              Interne Notizen
            </h3>
            <div className="flex-1 max-h-[300px] overflow-y-auto space-y-3 mb-4">
              {notizen.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Noch keine Notizen vorhanden.</p>
              ) : (
                notizen.map((n) => (
                  <div key={n.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(n.created_at), "dd.MM.yyyy HH:mm", { locale: de })}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <Textarea
                value={neueNotiz}
                onChange={(e) => setNeueNotiz(e.target.value)}
                placeholder="Neue Notiz hinzufügen..."
                className="min-h-[60px] bg-white border-gray-300 text-gray-900 flex-1"
              />
              <Button
                onClick={addNotiz}
                disabled={saving || !neueNotiz.trim()}
                className="bg-gray-900 text-white hover:bg-gray-800 self-end"
              >
                <Save className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Verkäufer */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="h-1 bg-purple-500" />
        <div className="p-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-purple-500" />
            Verkäufer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Spalte 1: Avatar + Name */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{anfrage.verkaeufer_name}</p>
                <p className="text-xs text-gray-500">{anfrage.branding_name}</p>
              </div>
            </div>

            {/* Spalte 2: E-Mail */}
            {verkaeufer && (
              <DetailRow icon={Mail} iconColor="bg-purple-50 text-purple-600" label="E-Mail" value={verkaeufer.email} href={`mailto:${verkaeufer.email}`} />
            )}

            {/* Spalte 3: Telefon */}
            {verkaeufer && (
              <DetailRow icon={Phone} iconColor="bg-purple-50 text-purple-600" label="Telefon" value={verkaeufer.telefon} href={`tel:${verkaeufer.telefon}`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
