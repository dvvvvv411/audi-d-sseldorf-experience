import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
}

export default function AdminAnfragen() {
  const navigate = useNavigate();
  const [anfragen, setAnfragen] = useState<Anfrage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("anfragen")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setAnfragen(data);
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
                <TableHead className="w-12" />
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => navigate(`/admin/anfragen/${a.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
