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
      const [anfrRes, clicksRes] = await Promise.all([
        supabase.from("anfragen").select("*").order("created_at", { ascending: false }),
        supabase.from("mailbox_clicks").select("*").order("clicked_at", { ascending: false }),
      ]);
      if (anfrRes.data) setAnfragen(anfrRes.data);
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

  const openNotizen = (a: Anfrage) => {
    setSelectedAnfrage(a);
    setNotizenText(a.notizen || "");
  };

  const saveNotizen = async () => {
    if (!selectedAnfrage) return;
    setSaving(true);
    await supabase.from("anfragen").update({ notizen: notizenText }).eq("id", selectedAnfrage.id);
    setAnfragen((prev) =>
      prev.map((a) => (a.id === selectedAnfrage.id ? { ...a, notizen: notizenText } : a))
    );
    setSelectedAnfrage(null);
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
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`hover:bg-gray-100 ${a.notizen ? "text-amber-500 hover:text-amber-700" : "text-gray-400 hover:text-gray-600"}`}
                        onClick={() => openNotizen(a)}
                      >
                        <StickyNote className="w-4 h-4" />
                      </Button>
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => handleMailboxClick(a.id)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => navigate(`/admin/anfragen/${a.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedAnfrage} onOpenChange={(open) => !open && setSelectedAnfrage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Notizen – {selectedAnfrage?.vorname} {selectedAnfrage?.nachname}
            </DialogTitle>
          </DialogHeader>
          <Textarea
            value={notizenText}
            onChange={(e) => setNotizenText(e.target.value)}
            placeholder="Notizen zur Anfrage hinzufügen..."
            className="min-h-[160px] bg-white border-gray-300 text-gray-900"
          />
          <div className="flex justify-end">
            <Button onClick={saveNotizen} disabled={saving} className="bg-gray-900 text-white hover:bg-gray-800">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Speichern..." : "Notizen speichern"}
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
