import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Car, Plus, MessageSquare, LogOut, Search, Menu, X,
} from "lucide-react";
import { toast } from "sonner";

const AudiRingsSmall = () => (
  <svg viewBox="0 0 200 50" className="w-20 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="73" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="106" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="139" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
  </svg>
);

type Tab = "bestand" | "hinzufuegen" | "anfragen";

const mockVehicles = [
  { id: 1, modell: "Audi A3 Sportback", baujahr: 2024, preis: 35900, status: "Verfügbar" },
  { id: 2, modell: "Audi A4 Avant", baujahr: 2024, preis: 48500, status: "Verfügbar" },
  { id: 3, modell: "Audi Q5 S line", baujahr: 2023, preis: 62300, status: "Reserviert" },
  { id: 4, modell: "Audi e-tron GT", baujahr: 2024, preis: 106800, status: "Verfügbar" },
  { id: 5, modell: "Audi RS 6 Avant", baujahr: 2023, preis: 124900, status: "Verkauft" },
  { id: 6, modell: "Audi Q8 e-tron", baujahr: 2024, preis: 74500, status: "Verfügbar" },
];

const mockAnfragen = [
  { id: 1, name: "Thomas Müller", email: "t.mueller@email.de", betreff: "Probefahrt Audi e-tron GT", datum: "2026-03-25", status: "Neu" },
  { id: 2, name: "Anna Schmidt", email: "a.schmidt@email.de", betreff: "Finanzierungsangebot A4 Avant", datum: "2026-03-24", status: "In Bearbeitung" },
  { id: 3, name: "Michael Weber", email: "m.weber@email.de", betreff: "Gebrauchtwagen Q5 gesucht", datum: "2026-03-22", status: "Beantwortet" },
  { id: 4, name: "Lisa Hoffmann", email: "l.hoffmann@email.de", betreff: "Leasinganfrage RS 6", datum: "2026-03-20", status: "Neu" },
];

const statusColor = (s: string) => {
  switch (s) {
    case "Verfügbar": return "bg-emerald-100 text-emerald-700";
    case "Reserviert": return "bg-amber-100 text-amber-700";
    case "Verkauft": return "bg-gray-100 text-gray-500";
    case "Neu": return "bg-blue-100 text-blue-700";
    case "In Bearbeitung": return "bg-amber-100 text-amber-700";
    case "Beantwortet": return "bg-emerald-100 text-emerald-700";
    default: return "bg-gray-100 text-gray-600";
  }
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("bestand");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "bestand", label: "Fahrzeugbestand", icon: <Car className="w-5 h-5" /> },
    { id: "hinzufuegen", label: "Fahrzeug hinzufügen", icon: <Plus className="w-5 h-5" /> },
    { id: "anfragen", label: "Anfragen", icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const filteredVehicles = mockVehicles.filter((v) =>
    v.modell.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="text-gray-900">
            <AudiRingsSmall />
          </div>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-3">Verwaltung</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-none ${
                activeTab === item.id
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-none"
          >
            <LogOut className="w-5 h-5" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {/* Fahrzeugbestand */}
          {activeTab === "bestand" && (
            <div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Modell suchen…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
                  />
                </div>
                <span className="text-sm text-gray-500">{filteredVehicles.length} Fahrzeuge</span>
              </div>

              <div className="bg-white border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="text-gray-600 font-semibold">Modell</TableHead>
                      <TableHead className="text-gray-600 font-semibold">Baujahr</TableHead>
                      <TableHead className="text-gray-600 font-semibold text-right">Preis</TableHead>
                      <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((v) => (
                      <TableRow key={v.id} className="hover:bg-gray-50 border-gray-100">
                        <TableCell className="font-medium text-gray-900">{v.modell}</TableCell>
                        <TableCell className="text-gray-600">{v.baujahr}</TableCell>
                        <TableCell className="text-right text-gray-900 font-medium">
                          {v.preis.toLocaleString("de-DE")} €
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColor(v.status)}>
                            {v.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Fahrzeug hinzufügen */}
          {activeTab === "hinzufuegen" && (
            <div className="max-w-2xl">
              <div className="bg-white border border-gray-200 p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Fahrzeug hinzugefügt (Mockup)");
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">Modell</Label>
                      <Input placeholder="z.B. Audi A4 Avant" className="h-11 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-gray-900" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-700 text-sm font-medium">Baujahr</Label>
                      <Input type="number" placeholder="2024" className="h-11 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-gray-900" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 text-sm font-medium">Preis (€)</Label>
                    <Input type="number" placeholder="45000" className="h-11 bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-gray-900" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 text-sm font-medium">Beschreibung</Label>
                    <Textarea
                      placeholder="Ausstattung, Farbe, Extras…"
                      rows={4}
                      className="bg-gray-50 border-gray-200 text-gray-900 focus-visible:ring-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700 text-sm font-medium">Bilder</Label>
                    <div className="border-2 border-dashed border-gray-200 bg-gray-50 p-8 flex flex-col items-center justify-center text-gray-400 text-sm">
                      <Plus className="w-8 h-8 mb-2" />
                      <span>Bilder hochladen (Mockup)</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="h-12 px-8 bg-gray-900 text-white hover:bg-gray-800 text-sm tracking-wide uppercase font-medium"
                  >
                    Fahrzeug speichern
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Anfragen */}
          {activeTab === "anfragen" && (
            <div className="bg-white border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="text-gray-600 font-semibold">Name</TableHead>
                    <TableHead className="text-gray-600 font-semibold">E-Mail</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Betreff</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Datum</TableHead>
                    <TableHead className="text-gray-600 font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAnfragen.map((a) => (
                    <TableRow key={a.id} className="hover:bg-gray-50 border-gray-100">
                      <TableCell className="font-medium text-gray-900">{a.name}</TableCell>
                      <TableCell className="text-gray-600">{a.email}</TableCell>
                      <TableCell className="text-gray-900">{a.betreff}</TableCell>
                      <TableCell className="text-gray-600">{a.datum}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColor(a.status)}>
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
