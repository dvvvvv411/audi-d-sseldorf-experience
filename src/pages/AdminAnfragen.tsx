import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, StickyNote, Save, Mail, Settings, ChevronDown, ChevronUp, Receipt, Search, FileText, Download, Loader2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  fahrzeug_name: string;
  fahrzeug_preis: number;
  fahrzeug_id: string;
  verkaeufer_name: string;
  verkaeufer_id: string;
  branding_name: string;
  status: string;
  notizen: string | null;
  hidden?: boolean;
  strasse?: string | null;
  plz?: string | null;
  stadt?: string | null;
}

interface LogEntry {
  id: string;
  created_at: string;
  user_email: string;
  aktion: string;
  details: string | null;
  anfrage_id: string | null;
}

const statusOptions = [
  "Neu", "In Bearbeitung", "Möchte Daten", "Service gesendet", "Möchte Angebot",
  "Angebot gesendet", "Möchte Rechnung", "Rechnung gesendet", "Überwiesen", "Angekommen", "Kein Interesse"
];

const statusColors: Record<string, string> = {
  "Neu": "bg-gray-100 text-gray-800",
  "NEU": "bg-gray-100 text-gray-800",
  "In Bearbeitung": "bg-blue-100 text-blue-800",
  "Möchte Daten": "bg-yellow-100 text-yellow-800",
  "Service gesendet": "bg-cyan-100 text-cyan-800",
  "Möchte Angebot": "bg-indigo-100 text-indigo-800",
  "Angebot gesendet": "bg-emerald-100 text-emerald-800",
  "Möchte Rechnung": "bg-orange-100 text-orange-800",
  "Rechnung gesendet": "bg-purple-100 text-purple-800",
  "Überwiesen": "bg-green-100 text-green-800",
  "Angekommen": "bg-lime-100 text-lime-800",
  "Kein Interesse": "bg-red-100 text-red-800",
};

const displayStatus = (s: string) => s === "NEU" ? "Neu" : s;

const emailColors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500",
  "bg-amber-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
];

function getEmailColor(email: string): string {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  return emailColors[Math.abs(hash) % emailColors.length];
}

function getAktionLabel(aktion: string): { label: string; icon: typeof Settings } {
  switch (aktion) {
    case "status_geaendert": return { label: "Status geändert", icon: Settings };
    case "notiz_hinzugefuegt": return { label: "Notiz hinzugefügt", icon: StickyNote };
    case "mailbox_klick": return { label: "Mailbox geklickt", icon: Mail };
    default: return { label: aktion, icon: Settings };
  }
}

async function getUserEmail(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  return data.user?.email || "unbekannt";
}

async function logAktivitaet(aktion: string, details?: string | null, anfrageId?: string) {
  const email = await getUserEmail();
  await supabase.from("aktivitaets_log" as any).insert({
    user_email: email,
    aktion,
    details: details || null,
    anfrage_id: anfrageId || null,
  } as any);
}

export default function AdminAnfragen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anfragen, setAnfragen] = useState<Anfrage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnfrageId, setSelectedAnfrageId] = useState<string | null>(null);
  const [selectedAnfrageName, setSelectedAnfrageName] = useState("");
  const [notizen, setNotizen] = useState<{ id: string; text: string; created_at: string }[]>([]);
  const [neueNotiz, setNeueNotiz] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingNotizen, setLoadingNotizen] = useState(false);
  const [mailboxClicks, setMailboxClicks] = useState<Record<string, string[]>>({});
  const [mailboxPopupAnfrageId, setMailboxPopupAnfrageId] = useState<string | null>(null);
  const [notizenCounts, setNotizenCounts] = useState<Record<string, number>>({});
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [logOpen, setLogOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [exposeFahrzeuge, setExposeFahrzeuge] = useState<ExposeFahrzeug[]>([]);
  const [exposeVerkaeufer, setExposeVerkaeufer] = useState<ExposeVerkaeufer[]>([]);
  const [exposeBrandings, setExposeBrandings] = useState<ExposeBranding[]>([]);
  const [exposeDialogAnfrage, setExposeDialogAnfrage] = useState<Anfrage | null>(null);
  const [exposeSelectedFahrzeugId, setExposeSelectedFahrzeugId] = useState("");
  const [exposeSelectedVerkaeuferId, setExposeSelectedVerkaeuferId] = useState("");
  const [exposeSelectedBrandingId, setExposeSelectedBrandingId] = useState("");
  const [exposeGenerating, setExposeGenerating] = useState(false);
  const [exposePdfBlob, setExposePdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    const load = async () => {
      const [anfrRes, clicksRes, notizenRes, logRes] = await Promise.all([
        supabase.from("anfragen").select("*").order("created_at", { ascending: false }),
        supabase.from("mailbox_clicks").select("*").order("clicked_at", { ascending: false }),
        supabase.from("anfrage_notizen").select("anfrage_id"),
        supabase.from("aktivitaets_log" as any).select("*").order("created_at", { ascending: false }).limit(50),
      ]);
      if (anfrRes.data) setAnfragen(anfrRes.data);
      if (notizenRes.data) {
        const counts: Record<string, number> = {};
        for (const n of notizenRes.data) {
          counts[n.anfrage_id] = (counts[n.anfrage_id] || 0) + 1;
        }
        setNotizenCounts(counts);
      }
      if (clicksRes.data) {
        const grouped: Record<string, string[]> = {};
        for (const c of clicksRes.data) {
          if (!grouped[c.anfrage_id]) grouped[c.anfrage_id] = [];
          grouped[c.anfrage_id].push(c.clicked_at);
        }
        setMailboxClicks(grouped);
      }
      if (logRes.data) setLogEntries(logRes.data as any);
      setLoading(false);
    };
    load();
  }, []);

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

  const openExposeDialog = (a: Anfrage) => {
    setExposeDialogAnfrage(a);
    setExposeSelectedFahrzeugId(a.fahrzeug_id);
    setExposeSelectedVerkaeuferId(a.verkaeufer_id);
    const matchedBranding = exposeBrandings.find((b) => b.name === a.branding_name);
    setExposeSelectedBrandingId(matchedBranding?.id || "");
    setExposePdfBlob(null);
    setExposeGenerating(false);
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
    if (!exposePdfBlob || !exposeDialogAnfrage) return;
    const url = URL.createObjectURL(exposePdfBlob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = exposeDialogAnfrage.fahrzeug_name.replace(/[^a-zA-Z0-9äöüÄÖÜß\-_ ]/g, "").replace(/\s+/g, "_");
    a.download = `${safeName}_Expose.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const addLogEntry = (entry: LogEntry) => {
    setLogEntries((prev) => [entry, ...prev].slice(0, 50));
  };

  const handleMailboxClick = async (anfrageId: string) => {
    const now = new Date().toISOString();
    await supabase.from("mailbox_clicks").insert({ anfrage_id: anfrageId } as any);
    setMailboxClicks((prev) => ({
      ...prev,
      [anfrageId]: [now, ...(prev[anfrageId] || [])],
    }));
    const email = await getUserEmail();
    const anfrage = anfragen.find((a) => a.id === anfrageId);
    await logAktivitaet("mailbox_klick", anfrage ? `${anfrage.vorname} ${anfrage.nachname}` : null, anfrageId);
    addLogEntry({
      id: crypto.randomUUID(),
      created_at: now,
      user_email: email,
      aktion: "mailbox_klick",
      details: anfrage ? `${anfrage.vorname} ${anfrage.nachname}` : null,
      anfrage_id: anfrageId,
    });
  };

  const openNotizen = async (a: Anfrage) => {
    setSelectedAnfrageId(a.id);
    setSelectedAnfrageName(`${a.vorname} ${a.nachname}`);
    setNeueNotiz("");
    setLoadingNotizen(true);
    const { data } = await supabase
      .from("anfrage_notizen")
      .select("*")
      .eq("anfrage_id", a.id)
      .order("created_at", { ascending: true });
    setNotizen(data || []);
    setLoadingNotizen(false);
  };

  const addNotiz = async () => {
    if (!selectedAnfrageId || !neueNotiz.trim()) return;
    setSaving(true);
    const { data } = await supabase
      .from("anfrage_notizen")
      .insert({ anfrage_id: selectedAnfrageId, text: neueNotiz.trim() } as any)
      .select()
      .single();
    if (data) {
      setNotizen((prev) => [...prev, data]);
      setNotizenCounts((prev) => ({
        ...prev,
        [selectedAnfrageId]: (prev[selectedAnfrageId] || 0) + 1,
      }));
      const email = await getUserEmail();
      const now = new Date().toISOString();
      const anfrage = anfragen.find((x) => x.id === selectedAnfrageId);
      const detailText = anfrage
        ? `${anfrage.vorname} ${anfrage.nachname}: ${neueNotiz.trim()}`
        : neueNotiz.trim();
      await logAktivitaet("notiz_hinzugefuegt", detailText, selectedAnfrageId);
      addLogEntry({
        id: crypto.randomUUID(),
        created_at: now,
        user_email: email,
        aktion: "notiz_hinzugefuegt",
        details: detailText,
        anfrage_id: selectedAnfrageId,
      });
    }
    setNeueNotiz("");
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0 }).format(p);

  const truncate = (text: string, max = 30) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const copyToClipboard = (text: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert", description: `${label} wurde kopiert.` });
  };

  return (
    <div>
      {/* Aktivitätsprotokoll */}
      <Collapsible open={logOpen} onOpenChange={setLogOpen} className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900">Aktivitätsprotokoll</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-500">
              {logOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-[300px] overflow-y-auto">
            {logEntries.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Noch keine Aktivitäten protokolliert.</p>
            ) : (
              <div className="space-y-3">
                {logEntries.map((entry) => {
                  const { label, icon: Icon } = getAktionLabel(entry.aktion);
                  const dotColor = getEmailColor(entry.user_email);
                  return (
                    <div key={entry.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-3 h-3 rounded-full ${dotColor}`} />
                      </div>
                      <div className="flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {entry.details && (
                          <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{entry.details}</p>
                        )}
                        <div className="flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="text-[10px] text-gray-400">{entry.user_email}</span>
                          <span className="text-[10px] text-gray-400">·</span>
                          <span className="text-[10px] text-gray-400">{label}</span>
                          <span className="text-[10px] text-gray-400">·</span>
                          <span className="text-[10px] text-gray-400">
                            {format(new Date(entry.created_at), "dd.MM.yyyy HH:mm", { locale: de })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Anfragen</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name, E-Mail, Telefon, Fahrzeug…"
              className="pl-9 w-[300px] h-9 text-sm"
            />
          </div>
          <Button
            variant={showHidden ? "default" : "outline"}
            size="sm"
            onClick={() => setShowHidden(!showHidden)}
            className="gap-1.5"
          >
            {showHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {showHidden ? "Ausgeblendete" : "Ausgeblendete"}
          </Button>
        </div>
      </div>

      {(() => {
        const q = searchQuery.toLowerCase();
        const filtered = anfragen.filter((a) => {
          const matchHidden = showHidden ? a.hidden === true : a.hidden !== true;
          if (!matchHidden) return false;
          if (!q) return true;
          const fullName = `${a.vorname} ${a.nachname}`.toLowerCase();
          return fullName.includes(q) || a.email.toLowerCase().includes(q) || a.telefon.toLowerCase().includes(q) || a.fahrzeug_name.toLowerCase().includes(q);
        });
        if (filtered.length === 0) return <p className="text-gray-500">Keine Anfragen gefunden.</p>;
        return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600 font-semibold">Datum</TableHead>
                <TableHead className="text-gray-600 font-semibold">Name</TableHead>
                <TableHead className="text-gray-600 font-semibold">E-Mail</TableHead>
                <TableHead className="text-gray-600 font-semibold">Telefon</TableHead>
                <TableHead className="text-gray-600 font-semibold">Nachricht</TableHead>
                <TableHead className="text-gray-600 font-semibold">Verkäufer</TableHead>
                <TableHead className="text-right text-gray-600 font-semibold">Preis</TableHead>
                <TableHead className="text-gray-600 font-semibold">Fahrzeug</TableHead>
                <TableHead className="text-gray-600 font-semibold">Branding</TableHead>
                <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="border-gray-100 cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/admin/anfragen/${a.id}`)}>
                  <TableCell className="whitespace-nowrap text-gray-500 text-sm">{format(new Date(a.created_at), "dd.MM.yyyy HH:mm", { locale: de })}</TableCell>
                  <TableCell className="font-medium whitespace-nowrap text-gray-900">
                    <span className="cursor-pointer hover:underline" onClick={(e) => copyToClipboard(`${a.vorname} ${a.nachname}`, "Name", e)}>{a.vorname} {a.nachname}</span>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    <span className="cursor-pointer hover:underline" onClick={(e) => copyToClipboard(a.email, "E-Mail", e)}>{a.email}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-700">
                    <span className="cursor-pointer hover:underline" onClick={(e) => copyToClipboard(a.telefon, "Telefonnummer", e)}>{a.telefon}</span>
                  </TableCell>
                  <TableCell className="text-gray-500">{truncate(a.nachricht)}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-700">{a.verkaeufer_name}</TableCell>
                  <TableCell className="text-right whitespace-nowrap text-gray-900">{formatPrice(a.fahrzeug_preis)} €</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-700">{a.fahrzeug_name}</TableCell>
                  <TableCell className="text-gray-700">{a.branding_name}</TableCell>
                  <TableCell>
                    <div onClick={(e) => e.stopPropagation()}><Select
                      value={displayStatus(a.status)}
                      onValueChange={async (val) => {
                        const oldStatus = displayStatus(a.status);
                        const { error } = await supabase.from("anfragen").update({ status: val }).eq("id", a.id);
                        if (error) {
                          toast({ title: "Fehler", description: "Status konnte nicht aktualisiert werden.", variant: "destructive" });
                        } else {
                          setAnfragen((prev) => prev.map((x) => x.id === a.id ? { ...x, status: val } : x));
                          toast({ title: "Status aktualisiert", description: `Status auf "${val}" gesetzt.` });
                          const email = await getUserEmail();
                          const now = new Date().toISOString();
                          await logAktivitaet("status_geaendert", `${a.vorname} ${a.nachname}: ${oldStatus} → ${val}`, a.id);
                          addLogEntry({
                            id: crypto.randomUUID(),
                            created_at: now,
                            user_email: email,
                            aktion: "status_geaendert",
                            details: `${a.vorname} ${a.nachname}: ${oldStatus} → ${val}`,
                            anfrage_id: a.id,
                          });
                        }
                      }}
                    >
                      <SelectTrigger className={`w-[170px] h-8 text-xs font-medium border border-gray-200 ${statusColors[displayStatus(a.status)] || "bg-gray-100 text-gray-800"}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select></div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={300}>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={`hover:bg-gray-100 ${(notizenCounts[a.id] || 0) > 0 ? "text-amber-500 hover:text-amber-700" : "text-gray-400 hover:text-gray-600"}`}
                                onClick={() => openNotizen(a)}
                              >
                                <StickyNote className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Notizen</TooltipContent>
                          </Tooltip>
                          {(notizenCounts[a.id] || 0) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                              {notizenCounts[a.id]}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                onClick={() => handleMailboxClick(a.id)}
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Mailbox</TooltipContent>
                          </Tooltip>
                          {(mailboxClicks[a.id]?.length || 0) > 0 && (
                            <span
                              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMailboxPopupAnfrageId(a.id);
                              }}
                            >
                              {mailboxClicks[a.id].length}
                            </span>
                          )}
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                              onClick={() => {
                                const params = new URLSearchParams({
                                  fahrzeug: a.fahrzeug_id,
                                  verkaeufer: a.verkaeufer_id,
                                  branding: a.branding_name,
                                  name: `${a.vorname} ${a.nachname}`,
                                });
                                if (a.strasse) params.set("strasse", a.strasse);
                                if (a.plz && a.stadt) params.set("plzstadt", `${a.plz} ${a.stadt}`);
                                else if (a.stadt) params.set("plzstadt", a.stadt);
                                navigate(`/admin/angebote?${params.toString()}`);
                              }}
                            >
                              <Receipt className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Angebot erstellen</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                              onClick={() => navigate(`/admin/anfragen/${a.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Details</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                              onClick={async () => {
                                const newHidden = !a.hidden;
                                await supabase.from("anfragen").update({ hidden: newHidden } as any).eq("id", a.id);
                                setAnfragen((prev) => prev.map((x) => x.id === a.id ? { ...x, hidden: newHidden } : x));
                                toast({ title: newHidden ? "Ausgeblendet" : "Eingeblendet" });
                              }}
                            >
                              {a.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{a.hidden ? "Einblenden" : "Ausblenden"}</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        );
      })()}

      <Dialog open={!!selectedAnfrageId} onOpenChange={(open) => !open && setSelectedAnfrageId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Notizen – {selectedAnfrageName}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-3">
            {loadingNotizen ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
              </div>
            ) : notizen.length === 0 ? (
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
        </DialogContent>
      </Dialog>

      <Dialog open={!!mailboxPopupAnfrageId} onOpenChange={(open) => !open && setMailboxPopupAnfrageId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Mailbox-Klicks</DialogTitle>
          </DialogHeader>
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {(mailboxClicks[mailboxPopupAnfrageId || ""] || []).length === 0 ? (
              <p className="text-gray-500 text-sm">Keine Klicks vorhanden.</p>
            ) : (
              (mailboxClicks[mailboxPopupAnfrageId || ""] || []).map((ts, i) => (
                <div key={i} className="text-sm text-gray-700 py-1 border-b border-gray-100 last:border-0">
                  {format(new Date(ts), "dd.MM.yyyy HH:mm", { locale: de })}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
