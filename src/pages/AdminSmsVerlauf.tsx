import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Search, ExternalLink } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

type SmsRow = {
  id: string;
  created_at: string;
  anfrage_id: string | null;
  branding_id: string | null;
  empfaenger: string;
  absender: string | null;
  text: string;
  status: string;
  fehler: string | null;
  seven_response: unknown;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const AdminSmsVerlauf = () => {
  const [rows, setRows] = useState<SmsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"alle" | "gesendet" | "fehlgeschlagen">("alle");
  const [detail, setDetail] = useState<SmsRow | null>(null);
  const [brandingNames, setBrandingNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [{ data: smsData }, { data: brandingData }] = await Promise.all([
        supabase.from("sms_verlauf").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("brandings").select("id, name"),
      ]);
      setRows((smsData ?? []) as SmsRow[]);
      const map: Record<string, string> = {};
      (brandingData ?? []).forEach((b: { id: string; name: string }) => { map[b.id] = b.name; });
      setBrandingNames(map);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "alle" && r.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.empfaenger.toLowerCase().includes(q) ||
      r.text.toLowerCase().includes(q) ||
      (r.absender?.toLowerCase().includes(q) ?? false)
    );
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <p className="text-sm text-gray-500">{filtered.length} von {rows.length} SMS</p>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche Empfänger / Text"
              className="pl-9 w-64 bg-white border-gray-200"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "alle" | "gesendet" | "fehlgeschlagen")}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="alle">Alle</option>
            <option value="gesendet">Gesendet</option>
            <option value="fehlgeschlagen">Fehlgeschlagen</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Noch keine SMS versendet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Datum</th>
                <th className="text-left px-4 py-3 font-medium">Empfänger</th>
                <th className="text-left px-4 py-3 font-medium">Absender</th>
                <th className="text-left px-4 py-3 font-medium">Branding</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Text</th>
                <th className="text-left px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setDetail(r)}
                  className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{formatDate(r.created_at)}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{r.empfaenger}</td>
                  <td className="px-4 py-3 text-gray-600">{r.absender ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.branding_id ? brandingNames[r.branding_id] ?? "—" : "—"}</td>
                  <td className="px-4 py-3">
                    {r.status === "gesendet" ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-medium">
                        Gesendet
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 text-xs font-medium">
                        Fehlgeschlagen
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 max-w-md truncate">{r.text}</td>
                  <td className="px-4 py-3 text-right">
                    {r.anfrage_id && (
                      <Link
                        to={`/admin/anfragen/${r.anfrage_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-xs"
                      >
                        Anfrage <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>SMS Details</DialogTitle>
            <DialogDescription>Vollständige Informationen zu dieser SMS</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Zeitpunkt</p>
                  <p className="text-gray-900">{formatDate(detail.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Status</p>
                  {detail.status === "gesendet" ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 text-green-700 px-2.5 py-0.5 text-xs font-medium">
                      Gesendet
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 text-red-700 px-2.5 py-0.5 text-xs font-medium">
                      Fehlgeschlagen
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Empfänger</p>
                  <p className="text-gray-900 font-mono">{detail.empfaenger}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Absender</p>
                  <p className="text-gray-900">{detail.absender ?? "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Text</p>
                <pre className="whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-800 text-sm">{detail.text}</pre>
              </div>

              {detail.fehler && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fehler</p>
                  <pre className="whitespace-pre-wrap bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-xs">{detail.fehler}</pre>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Seven.io Antwort</p>
                <pre className="whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-md p-3 text-gray-700 text-xs overflow-x-auto">
                  {JSON.stringify(detail.seven_response, null, 2)}
                </pre>
              </div>

              {detail.anfrage_id && (
                <Link
                  to={`/admin/anfragen/${detail.anfrage_id}`}
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 text-sm"
                >
                  Zur Anfrage <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminSmsVerlauf;
