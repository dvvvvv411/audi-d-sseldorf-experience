import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Car, ShoppingCart, Clock, MessageSquare } from "lucide-react";

const mockVehicles = [
  { id: 1, modell: "Audi A3 Sportback", baujahr: 2024, preis: 35900, status: "Verfügbar" },
  { id: 2, modell: "Audi A4 Avant", baujahr: 2024, preis: 48500, status: "Verfügbar" },
  { id: 3, modell: "Audi Q5 S line", baujahr: 2023, preis: 62300, status: "Reserviert" },
  { id: 4, modell: "Audi e-tron GT", baujahr: 2024, preis: 106800, status: "Verfügbar" },
  { id: 5, modell: "Audi RS 6 Avant", baujahr: 2023, preis: 124900, status: "Verkauft" },
  { id: 6, modell: "Audi Q8 e-tron", baujahr: 2024, preis: 74500, status: "Verfügbar" },
];

const mockAnfragen = [
  { id: 1, name: "Thomas Müller", betreff: "Probefahrt Audi e-tron GT", datum: "2026-03-25", status: "Neu" },
  { id: 2, name: "Anna Schmidt", betreff: "Finanzierungsangebot A4 Avant", datum: "2026-03-24", status: "In Bearbeitung" },
  { id: 3, name: "Michael Weber", betreff: "Gebrauchtwagen Q5 gesucht", datum: "2026-03-22", status: "Beantwortet" },
  { id: 4, name: "Lisa Hoffmann", betreff: "Leasinganfrage RS 6", datum: "2026-03-20", status: "Neu" },
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

const stats = [
  { label: "Fahrzeuge gesamt", value: mockVehicles.length, icon: Car, color: "text-white" },
  { label: "Verfügbar", value: mockVehicles.filter(v => v.status === "Verfügbar").length, icon: ShoppingCart, color: "text-emerald-400" },
  { label: "Reserviert", value: mockVehicles.filter(v => v.status === "Reserviert").length, icon: Clock, color: "text-amber-400" },
  { label: "Neue Anfragen", value: mockAnfragen.filter(a => a.status === "Neu").length, icon: MessageSquare, color: "text-blue-400" },
];

const AdminDashboard = () => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-gray-200 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-none flex items-center justify-center">
            <s.icon className={`w-6 h-6 ${s.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Neueste Fahrzeuge</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-semibold">Modell</TableHead>
              <TableHead className="text-gray-600 font-semibold text-right">Preis</TableHead>
              <TableHead className="text-gray-600 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockVehicles.slice(0, 3).map((v) => (
              <TableRow key={v.id} className="hover:bg-gray-50 border-gray-100">
                <TableCell className="font-medium text-gray-900">{v.modell}</TableCell>
                <TableCell className="text-right text-gray-900 font-medium">
                  {v.preis.toLocaleString("de-DE")} €
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColor(v.status)}>{v.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Aktuelle Anfragen</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-gray-600 font-semibold">Name</TableHead>
              <TableHead className="text-gray-600 font-semibold">Betreff</TableHead>
              <TableHead className="text-gray-600 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAnfragen.slice(0, 3).map((a) => (
              <TableRow key={a.id} className="hover:bg-gray-50 border-gray-100">
                <TableCell className="font-medium text-gray-900">{a.name}</TableCell>
                <TableCell className="text-gray-600">{a.betreff}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={statusColor(a.status)}>{a.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </>
);

export default AdminDashboard;
