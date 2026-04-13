import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Save, User, Mail, Phone, Calendar,
  Car, Fuel, Gauge, Palette, CreditCard, Quote,
  StickyNote, MapPin, Cog, Zap, Hash, Receipt,
  FileText, Download, Loader2, Pencil, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { generateExposePdf, type ExposeFahrzeug, type ExposeVerkaeufer, type ExposeBranding } from "@/lib/expose-pdf";

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
  strasse?: string | null;
  plz?: string | null;
  stadt?: string | null;
}

const statusOptions = [
  "Neu", "In Bearbeitung", "Möchte Daten", "Service gesendet", "Möchte Angebot",
  "Angebot gesendet", "Möchte Rechnung", "Rechnung gesendet", "Überwiesen", "Angekommen", "Kein Interesse"
];

const statusColors: Record<string, string> = {
  "Neu": "bg-gray-100 text-gray-800 border-gray-200",
  "NEU": "bg-gray-100 text-gray-800 border-gray-200",
  "In Bearbeitung": "bg-blue-100 text-blue-800 border-blue-200",
  "Möchte Daten": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Service gesendet": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "Möchte Angebot": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Angebot gesendet": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Möchte Rechnung": "bg-orange-100 text-orange-800 border-orange-200",
  "Rechnung gesendet": "bg-purple-100 text-purple-800 border-purple-200",
  "Überwiesen": "bg-green-100 text-green-800 border-green-200",
  "Angekommen": "bg-lime-100 text-lime-800 border-lime-200",
  "Kein Interesse": "bg-red-100 text-red-800 border-red-200",
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
  const [adresseStrasse, setAdresseStrasse] = useState("");
  const [adressePlz, setAdressePlz] = useState("");
  const [adresseStadt, setAdresseStadt] = useState("");
  const [adresseSaving, setAdresseSaving] = useState(false);
  const notizenRef = useRef<HTMLDivElement>(null);

  // Editable contact fields
  const [editVorname, setEditVorname] = useState("");
  const [editNachname, setEditNachname] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editTelefon, setEditTelefon] = useState("");
  const [contactSaving, setContactSaving] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingAdresse, setEditingAdresse] = useState(false);

  // Mailbox history
  const [mailboxClicks, setMailboxClicks] = useState<string[]>([]);

  // Expose dialog
  const [exposeOpen, setExposeOpen] = useState(false);
  const [exposeFahrzeuge, setExposeFahrzeuge] = useState<ExposeFahrzeug[]>([]);
  const [exposeVerkaeufer, setExposeVerkaeufer] = useState<ExposeVerkaeufer[]>([]);
  const [exposeBrandings, setExposeBrandings] = useState<ExposeBranding[]>([]);
  const [exposeSelectedFahrzeugId, setExposeSelectedFahrzeugId] = useState("");
  const [exposeSelectedVerkaeuferId, setExposeSelectedVerkaeuferId] = useState("");
  const [exposeSelectedBrandingId, setExposeSelectedBrandingId] = useState("");
  const [exposeGenerating, setExposeGenerating] = useState(false);
  const [exposePdfBlob, setExposePdfBlob] = useState<Blob | null>(null);

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
        setAdresseStrasse(data.strasse || "");
        setAdressePlz(data.plz || "");
        setAdresseStadt(data.stadt || "");
        setEditVorname(data.vorname);
        setEditNachname(data.nachname);
        setEditEmail(data.email);
        setEditTelefon(data.telefon);
        const [fzRes, vkRes, notizenRes, clicksRes] = await Promise.all([
          supabase.from("fahrzeuge").select("*").eq("id", data.fahrzeug_id).single(),
          supabase.from("verkaeufer").select("*").eq("id", data.verkaeufer_id).single(),
          supabase.from("anfrage_notizen").select("*").eq("anfrage_id", data.id).order("created_at", { ascending: true }),
          supabase.from("mailbox_clicks").select("*").eq("anfrage_id", data.id).order("clicked_at", { ascending: false }),
        ]);
        if (fzRes.data) setFahrzeug(fzRes.data);
        if (vkRes.data) setVerkaeufer(vkRes.data);
        if (notizenRes.data) setNotizen(notizenRes.data);
        if (clicksRes.data) setMailboxClicks(clicksRes.data.map((c: any) => c.clicked_at));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  useEffect(() => {
    const loadExposeData = async () => {
      const [fRes, vRes, bRes] = await Promise.all([
        supabase.from("fahrzeuge").select("*").eq("aktiv", true).order("fahrzeugname"),
        supabase.from("verkaeufer").select("*").order("nachname"),
        supabase.from("brandings").select("*").order("name"),
      ]);
      setExposeFahrzeuge((fRes.data as ExposeFahrzeug[]) ?? []);
      setExposeVerkaeufer((vRes.data as ExposeVerkaeufer[]) ?? []);
      setExposeBrandings((bRes.data as ExposeBranding[]) ?? []);
    };
    loadExposeData();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert", description: `${label} wurde kopiert.` });
  };

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

  const saveAdresse = async () => {
    if (!id) return;
    setAdresseSaving(true);
    await supabase.from("anfragen").update({
      strasse: adresseStrasse || null,
      plz: adressePlz || null,
      stadt: adresseStadt || null,
    } as any).eq("id", id);
    if (anfrage) {
      setAnfrage({ ...anfrage, strasse: adresseStrasse || null, plz: adressePlz || null, stadt: adresseStadt || null });
    }
    toast({ title: "Adresse gespeichert" });
    setAdresseSaving(false);
  };

  const saveContact = async () => {
    if (!id || !anfrage) return;
    setContactSaving(true);
    const { error } = await supabase.from("anfragen").update({
      vorname: editVorname,
      nachname: editNachname,
      email: editEmail,
      telefon: editTelefon,
    }).eq("id", id);
    if (error) {
      toast({ title: "Fehler", description: "Kontaktdaten konnten nicht gespeichert werden.", variant: "destructive" });
    } else {
      setAnfrage({ ...anfrage, vorname: editVorname, nachname: editNachname, email: editEmail, telefon: editTelefon });
      toast({ title: "Kontaktdaten gespeichert" });
    }
    setContactSaving(false);
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

  const handleMailboxClick = async () => {
    if (!id || !anfrage) return;
    const now = new Date().toISOString();
    await supabase.from("mailbox_clicks").insert({ anfrage_id: id } as any);
    setMailboxClicks((prev) => [now, ...prev]);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("aktivitaets_log").insert({
        user_email: user.email || "",
        aktion: "mailbox_klick",
        anfrage_id: id,
        details: `${anfrage.vorname} ${anfrage.nachname}`,
      });
    }
    toast({ title: "Mailbox-Klick registriert" });
  };

  const navigateToAngebot = () => {
    if (!anfrage) return;
    const params = new URLSearchParams({
      fahrzeug: anfrage.fahrzeug_id,
      verkaeufer: anfrage.verkaeufer_id,
      branding: anfrage.branding_name,
      name: `${anfrage.vorname} ${anfrage.nachname}`,
    });
    if (adresseStrasse) params.set("strasse", adresseStrasse);
    if (adressePlz && adresseStadt) params.set("plzstadt", `${adressePlz} ${adresseStadt}`);
    else if (adresseStadt) params.set("plzstadt", adresseStadt);
    navigate(`/admin/angebote?${params.toString()}`);
  };

  const openExposeDialog = () => {
    if (!anfrage) return;
    setExposeSelectedFahrzeugId(anfrage.fahrzeug_id);
    setExposeSelectedVerkaeuferId(anfrage.verkaeufer_id);
    const matchedBranding = exposeBrandings.find((b) => b.name === anfrage.branding_name);
    setExposeSelectedBrandingId(matchedBranding?.id || "");
    setExposePdfBlob(null);
    setExposeGenerating(false);
    setExposeOpen(true);
  };

  const handleExposeGenerate = async () => {
    const fz = exposeFahrzeuge.find((f) => f.id === exposeSelectedFahrzeugId);
    const vk = exposeVerkaeufer.find((v) => v.id === exposeSelectedVerkaeuferId);
    const br = exposeBrandings.find((b) => b.id === exposeSelectedBrandingId);
    if (!fz || !vk || !br) return;
    setExposeGenerating(true);
    try {
      const blob = await generateExposePdf(fz, vk, br);
      setExposePdfBlob(blob);
      toast({ title: "Exposé erstellt" });
    } catch (err) {
      console.error(err);
      toast({ title: "Fehler", description: "Exposé konnte nicht erstellt werden.", variant: "destructive" });
    } finally {
      setExposeGenerating(false);
    }
  };

  const handleExposeDownload = () => {
    if (!exposePdfBlob || !anfrage) return;
    const url = URL.createObjectURL(exposePdfBlob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = anfrage.fahrzeug_name.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
    a.download = `${safeName}_Expose.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const DetailRow = ({ icon, iconColor, label, value, href, onClick }: { icon: any; iconColor: string; label: string; value: string | null | undefined; href?: string; onClick?: () => void }) => (
    <div className="flex items-center gap-3 py-2.5">
      <IconBadge icon={icon} color={iconColor} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        {onClick && value ? (
          <p className="text-sm font-medium text-gray-900 cursor-pointer hover:underline hover:text-blue-600 transition-colors" onClick={onClick}>{value}</p>
        ) : href && value ? (
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
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

      {/* Aktionsbuttons */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notizenRef.current?.scrollIntoView({ behavior: "smooth" })}>
            <StickyNote className="w-4 h-4" />
            Notizen
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleMailboxClick}>
            <Mail className="w-4 h-4" />
            Mailbox
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={navigateToAngebot}>
            <Receipt className="w-4 h-4" />
            Angebot erstellen
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={openExposeDialog}>
            <FileText className="w-4 h-4" />
            Exposé erstellen
          </Button>
        </div>
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
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Vorname</label>
                  <Input value={editVorname} onChange={(e) => setEditVorname(e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Nachname</label>
                  <Input value={editNachname} onChange={(e) => setEditNachname(e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">E-Mail</label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="h-8 text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">Telefon</label>
                <Input value={editTelefon} onChange={(e) => setEditTelefon(e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" variant="outline" className="gap-1.5" onClick={saveContact} disabled={contactSaving}>
                  <Save className="w-3.5 h-3.5" />
                  Speichern
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-gray-500" onClick={() => copyToClipboard(`${editVorname} ${editNachname}`, "Name")}>
                  <Copy className="w-3.5 h-3.5" />
                  Name
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-gray-500" onClick={() => copyToClipboard(editEmail, "E-Mail")}>
                  <Copy className="w-3.5 h-3.5" />
                  E-Mail
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-gray-500" onClick={() => copyToClipboard(editTelefon, "Telefon")}>
                  <Copy className="w-3.5 h-3.5" />
                  Telefon
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-3">{formatDate(anfrage.created_at)}</div>

            {/* Adressfelder */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Adresse (optional)
              </h4>
              <div className="space-y-2">
                <Input
                  value={adresseStrasse}
                  onChange={(e) => setAdresseStrasse(e.target.value)}
                  placeholder="Straße & Hausnummer"
                  className="h-8 text-sm"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={adressePlz}
                    onChange={(e) => setAdressePlz(e.target.value)}
                    placeholder="PLZ"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={adresseStadt}
                    onChange={(e) => setAdresseStadt(e.target.value)}
                    placeholder="Stadt"
                    className="h-8 text-sm col-span-2"
                  />
                </div>
                <Button size="sm" variant="outline" className="gap-1.5 mt-1" onClick={saveAdresse} disabled={adresseSaving}>
                  <Save className="w-3.5 h-3.5" />
                  Speichern
                </Button>
              </div>
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
        <div ref={notizenRef} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
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

      {/* Row 3: Verkäufer + Mailbox-Verlauf */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-purple-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              Verkäufer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                  {initials}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{anfrage.verkaeufer_name}</p>
                  <p className="text-xs text-gray-500">{anfrage.branding_name}</p>
                </div>
              </div>

              {verkaeufer && (
                <DetailRow icon={Mail} iconColor="bg-purple-50 text-purple-600" label="E-Mail" value={verkaeufer.email} href={`mailto:${verkaeufer.email}`} />
              )}

              {verkaeufer && (
                <DetailRow icon={Phone} iconColor="bg-purple-50 text-purple-600" label="Telefon" value={verkaeufer.telefon} href={`tel:${verkaeufer.telefon}`} />
              )}
            </div>
          </div>
        </div>

        {/* Mailbox-Verlauf */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="h-1 bg-red-500" />
          <div className="p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-500" />
              Mailbox-Verlauf
              {mailboxClicks.length > 0 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold rounded-full px-2 py-0.5">{mailboxClicks.length}</span>
              )}
            </h3>
            <div className="max-h-[200px] overflow-y-auto space-y-1">
              {mailboxClicks.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Keine Mailbox-Klicks vorhanden.</p>
              ) : (
                mailboxClicks.map((ts, i) => (
                  <div key={i} className="text-sm text-gray-700 py-1.5 border-b border-gray-100 last:border-0 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {format(new Date(ts), "dd.MM.yyyy HH:mm", { locale: de })}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expose Dialog */}
      <Dialog open={exposeOpen} onOpenChange={(open) => { if (!open) { setExposeOpen(false); setExposePdfBlob(null); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Exposé erstellen – {anfrage.fahrzeug_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Fahrzeug</label>
              <Select value={exposeSelectedFahrzeugId} onValueChange={setExposeSelectedFahrzeugId}>
                <SelectTrigger><SelectValue placeholder="Fahrzeug wählen…" /></SelectTrigger>
                <SelectContent>
                  {exposeFahrzeuge.map((f) => (
                    <SelectItem key={f.id} value={f.id}>{f.fahrzeugname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Verkäufer</label>
              <Select value={exposeSelectedVerkaeuferId} onValueChange={setExposeSelectedVerkaeuferId}>
                <SelectTrigger><SelectValue placeholder="Verkäufer wählen…" /></SelectTrigger>
                <SelectContent>
                  {exposeVerkaeufer.map((v) => (
                    <SelectItem key={v.id} value={v.id}>{v.vorname} {v.nachname}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Branding</label>
              <Select value={exposeSelectedBrandingId} onValueChange={setExposeSelectedBrandingId}>
                <SelectTrigger><SelectValue placeholder="Branding wählen…" /></SelectTrigger>
                <SelectContent>
                  {exposeBrandings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleExposeGenerate} disabled={!exposeSelectedFahrzeugId || !exposeSelectedVerkaeuferId || !exposeSelectedBrandingId || exposeGenerating}>
                {exposeGenerating ? <Loader2 className="animate-spin w-4 h-4" /> : <FileText className="w-4 h-4" />}
                {exposeGenerating ? "Wird erstellt…" : "Exposé erstellen"}
              </Button>
              {exposePdfBlob && (
                <Button variant="outline" onClick={handleExposeDownload}>
                  <Download className="w-4 h-4" />
                  PDF herunterladen
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
