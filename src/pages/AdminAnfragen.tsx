import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, StickyNote, Save, Mail } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
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
  fahrzeug_name: string;
  fahrzeug_preis: number;
  verkaeufer_name: string;
  branding_name: string;
  status: string;
  notizen: string | null;
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

  useEffect(() => {
    const load = async () => {
      const [anfrRes, clicksRes, notizenRes] = await Promise.all([
        supabase.from("anfragen").select("*").order("created_at", { ascending: false }),
        supabase.from("mailbox_clicks").select("*").order("clicked_at", { ascending: false }),
        supabase.from("anfrage_notizen").select("anfrage_id"),
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
      setLoading(false);
    };
    load();
  }, []);

  const handleMailboxClick = async (anfrageId: string) => {
    const now = new Date().toISOString();
    await supabase.from("mailbox_clicks").insert({ anfrage_id: anfrageId } as any);
    setMailboxClicks((prev) => ({
      ...prev,
      [anfrageId]: [now, ...(prev[anfrageId] || [])],
    }));
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Anfragen</h2>

      {anfragen.length === 0 ? (
        <p className="text-gray-500">Noch keine Anfragen vorhanden.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-gray-200">
                <TableHead className="text-gray-600 font-semibold">Name</TableHead>
                <TableHead className="text-gray-600 font-semibold">E-Mail</TableHead>
                <TableHead className="text-gray-600 font-semibold">Telefon</TableHead>
                <TableHead className="text-gray-600 font-semibold">Nachricht</TableHead>
                <TableHead className="text-gray-600 font-semibold">Verkäufer</TableHead>
                <TableHead className="text-right text-gray-600 font-semibold">Preis</TableHead>
                <TableHead className="text-gray-600 font-semibold">Fahrzeug</TableHead>
                <TableHead className="text-gray-600 font-semibold">Branding</TableHead>
                <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {anfragen.map((a) => (
                <TableRow key={a.id} className="border-gray-100">
                  <TableCell className="font-medium whitespace-nowrap text-gray-900">{a.vorname} {a.nachname}</TableCell>
                  <TableCell className="text-gray-700">{a.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-700">{a.telefon}</TableCell>
                  <TableCell className="text-gray-500">{truncate(a.nachricht)}</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-700">{a.verkaeufer_name}</TableCell>
                  <TableCell className="text-right whitespace-nowrap text-gray-900">{formatPrice(a.fahrzeug_preis)} €</TableCell>
                  <TableCell className="whitespace-nowrap text-gray-700">{a.fahrzeug_name}</TableCell>
                  <TableCell className="text-gray-700">{a.branding_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={300}>
                      <div className="flex items-center gap-1">
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
                              onClick={() => navigate(`/admin/anfragen/${a.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Details</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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
