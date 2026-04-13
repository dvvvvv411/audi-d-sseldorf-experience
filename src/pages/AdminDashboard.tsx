import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Car, MessageSquare, Clock, CheckCircle, TrendingUp, Users } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";

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

const displayStatus = (s: string) => (s === "NEU" ? "Neu" : s);

const closedStatuses = ["Überwiesen", "Angekommen", "Kein Interesse"];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [fahrzeugeCount, setFahrzeugeCount] = useState(0);
  const [neueCount, setNeueCount] = useState(0);
  const [offeneCount, setOffeneCount] = useState(0);
  const [erledigtCount, setErledigtCount] = useState(0);
  const [verkaeuferCount, setVerkaeuferCount] = useState(0);
  const [brandingsCount, setBrandingsCount] = useState(0);
  const [recentAnfragen, setRecentAnfragen] = useState<any[]>([]);
  const [recentFahrzeuge, setRecentFahrzeuge] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [
        fzCount, anfragen, vkCount, brCount, recentFz, activity
      ] = await Promise.all([
        supabase.from("fahrzeuge").select("id", { count: "exact", head: true }).eq("aktiv", true),
        supabase.from("anfragen").select("*").eq("hidden", false).order("created_at", { ascending: false }).limit(200),
        supabase.from("verkaeufer").select("id", { count: "exact", head: true }),
        supabase.from("brandings").select("id", { count: "exact", head: true }),
        supabase.from("fahrzeuge").select("*").eq("aktiv", true).order("created_at", { ascending: false }).limit(5),
        supabase.from("aktivitaets_log").select("*").order("created_at", { ascending: false }).limit(8),
      ]);

      setFahrzeugeCount(fzCount.count ?? 0);
      setVerkaeuferCount(vkCount.count ?? 0);
      setBrandingsCount(brCount.count ?? 0);

      const allAnfragen = anfragen.data ?? [];
      setNeueCount(allAnfragen.filter(a => a.status === "NEU" || a.status === "Neu").length);
      setOffeneCount(allAnfragen.filter(a => !closedStatuses.includes(a.status) && a.status !== "Kein Interesse").length);
      setErledigtCount(allAnfragen.filter(a => a.status === "Überwiesen" || a.status === "Angekommen").length);
      setRecentAnfragen(allAnfragen.slice(0, 5));
      setRecentFahrzeuge(recentFz.data ?? []);
      setRecentActivity(activity.data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  const stats = [
    { label: "Fahrzeuge aktiv", value: fahrzeugeCount, icon: Car, color: "text-white", bg: "bg-black" },
    { label: "Neue Anfragen", value: neueCount, icon: MessageSquare, color: "text-blue-400", bg: "bg-black" },
    { label: "Offene Anfragen", value: offeneCount, icon: Clock, color: "text-amber-400", bg: "bg-black" },
    { label: "Überwiesen/Angekommen", value: erledigtCount, icon: CheckCircle, color: "text-emerald-400", bg: "bg-black" },
    { label: "Verkäufer", value: verkaeuferCount, icon: Users, color: "text-purple-400", bg: "bg-black" },
    { label: "Brandings", value: brandingsCount, icon: TrendingUp, color: "text-cyan-400", bg: "bg-black" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 p-5 flex items-center gap-3">
            <div className={`w-10 h-10 ${s.bg} flex items-center justify-center flex-shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500 leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Neueste Anfragen */}
        <div className="lg:col-span-2 bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Neueste Anfragen</h2>
            <button onClick={() => navigate("/admin/anfragen")} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Alle anzeigen →
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-gray-600 font-semibold">Name</TableHead>
                <TableHead className="text-gray-600 font-semibold">Fahrzeug</TableHead>
                <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                <TableHead className="text-gray-600 font-semibold text-right">Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAnfragen.map((a) => (
                <TableRow
                  key={a.id}
                  className="hover:bg-gray-50 border-gray-100 cursor-pointer"
                  onClick={() => navigate(`/admin/anfragen/${a.id}`)}
                >
                  <TableCell className="font-medium text-gray-900">{a.vorname} {a.nachname}</TableCell>
                  <TableCell className="text-gray-600 text-sm">{a.fahrzeug_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[displayStatus(a.status)] || "bg-gray-100 text-gray-600"}>
                      {displayStatus(a.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-500 text-sm whitespace-nowrap">
                    {format(new Date(a.created_at), "dd.MM.yy", { locale: de })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Letzte Aktivitäten */}
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Letzte Aktivitäten</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.length === 0 && (
              <p className="p-6 text-sm text-gray-400">Keine Aktivitäten.</p>
            )}
            {recentActivity.map((a) => (
              <div key={a.id} className="px-6 py-3">
                <p className="text-sm text-gray-900 font-medium">{a.aktion.replace(/_/g, " ")}</p>
                {a.details && <p className="text-xs text-gray-500 mt-0.5 truncate">{a.details}</p>}
                <p className="text-[10px] text-gray-400 mt-1">
                  {format(new Date(a.created_at), "dd.MM.yy HH:mm", { locale: de })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Neueste Fahrzeuge */}
      <div className="mt-6 bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Neueste Fahrzeuge</h2>
          <button onClick={() => navigate("/admin/fahrzeugbestand")} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            Alle anzeigen →
          </button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-semibold">Fahrzeug</TableHead>
              <TableHead className="text-gray-600 font-semibold text-right">Preis</TableHead>
              <TableHead className="text-gray-600 font-semibold text-right">Erstellt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentFahrzeuge.map((f) => (
              <TableRow key={f.id} className="hover:bg-gray-50 border-gray-100 cursor-pointer" onClick={() => navigate(`/admin/fahrzeugbestand/${f.id}`)}>
                <TableCell className="font-medium text-gray-900">{f.fahrzeugname}</TableCell>
                <TableCell className="text-right text-gray-900 font-medium">
                  {Number(f.preis).toLocaleString("de-DE")} €
                </TableCell>
                <TableCell className="text-right text-gray-500 text-sm whitespace-nowrap">
                  {format(new Date(f.created_at), "dd.MM.yy", { locale: de })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminDashboard;
