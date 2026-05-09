import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Search, ExternalLink, Paperclip } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";

type EmailRow = {
  id: string;
  created_at: string;
  anfrage_id: string | null;
  branding_id: string | null;
  verkaeufer_id: string | null;
  empfaenger: string;
  absender: string | null;
  betreff: string | null;
  template: string | null;
  status: string;
  fehler: string | null;
  resend_id: string | null;
  attachments: Array<{ filename: string; size: number }> | null;
  html: string | null;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const templateLabel = (t: string | null) => {
  if (t === "service") return "Service gesendet";
  if (t === "angebot") return "Angebot gesendet";
  return t ?? "—";
};

const formatBytes = (n: number) => {
  if (!n) return "0 B";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
};

const AdminEmailVerlauf = () => {
  const [rows, setRows] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"alle" | "gesendet" | "fehlgeschlagen">("alle");
  const [templateFilter, setTemplateFilter] = useState<"alle" | "service" | "angebot">("alle");
  const [detail, setDetail] = useState<EmailRow | null>(null);
  const [brandingNames, setBrandingNames] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [emailRes, brandingRes] = await Promise.all([
        supabase.from("email_verlauf").select("*").order("created_at", { ascending: false }).limit(500),
        supabase.from("brandings").select("id, name"),
      ]);
      setRows((emailRes.data ?? []) as EmailRow[]);
      const map: Record<string, string> = {};
      (brandingRes.data ?? []).forEach((b: { id: string; name: string }) => { map[b.id] = b.name; });
      setBrandingNames(map);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const filtered = rows.filter((r) => {
    if (statusFilter !== "alle" && r.status !== statusFilter) return false;
    if (templateFilter !== "alle" && r.template !== templateFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.empfaenger.toLowerCase().includes(q) ||
      (r.betreff?.toLowerCase().includes(q) ?? false) ||
      (r.absender?.toLowerCase().includes(q) ?? false)
    );
  });

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <p className="text-sm text-gray-500">{filtered.length} von {rows.length} Emails</p>
        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche Empfänger / Betreff"
              className="pl-9 w-64 bg-white border-gray-200"
            />
          </div>
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value as "alle" | "service" | "angebot")}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="alle">Alle Templates</option>
            <option value="service">Service gesendet</option>
            <option value="angebot">Angebot gesendet</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "alle" | "gesendet" | "fehlgeschlagen")}
            className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white"
          >
            <option value="alle">Alle Status</option>
            <option value="gesendet">Gesendet</option>
            <option value="fehlgeschlagen">Fehlgeschlagen</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Mail className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Noch keine Emails versendet</p>
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
                <th className="text-left px-4 py-3 font-medium">Template</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium">Betreff</th>
                <th className="text-left px-4 py-3 font-medium">Anhänge</th>
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
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap max-w-xs truncate">{r.absender ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{r.branding_id ? brandingNames[r.branding_id] ?? "—" : "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2.5 py-0.5 text-xs font-medium">
                      {templateLabel(r.template)}
                    </span>
                  </td>
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
                  <td className="px-4 py-3 text-gray-600 max-w-md truncate">{r.betreff ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {r.attachments && r.attachments.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Paperclip className="w-3 h-3" />
                        {r.attachments.length}
                      </span>
                    ) : "—"}
                  </td>
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
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
            <DialogDescription>Vollständige Informationen zu dieser Email</DialogDescription>
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
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Template</p>
                  <p className="text-gray-900">{templateLabel(detail.template)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Resend ID</p>
                  <p className="text-gray-700 font-mono text-xs">{detail.resend_id ?? "—"}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Betreff</p>
                <p className="text-gray-900 font-medium">{detail.betreff ?? "—"}</p>
              </div>

              {detail.attachments && detail.attachments.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Anhänge</p>
                  <ul className="space-y-1">
                    {detail.attachments.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700 text-sm">
                        <Paperclip className="w-3 h-3 text-gray-400" />
                        <span>{a.filename}</span>
                        <span className="text-gray-400 text-xs">({formatBytes(a.size)})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {detail.fehler && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Fehler</p>
                  <pre className="whitespace-pre-wrap bg-red-50 border border-red-200 rounded-md p-3 text-red-800 text-xs">{detail.fehler}</pre>
                </div>
              )}

              {detail.html && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Email Vorschau</p>
                  <iframe
                    title="Email Preview"
                    sandbox=""
                    srcDoc={detail.html}
                    className="w-full h-[500px] border border-gray-200 rounded-md bg-white"
                  />
                </div>
              )}

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

export default AdminEmailVerlauf;
