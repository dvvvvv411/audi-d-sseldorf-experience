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
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Nachricht</TableHead>
                <TableHead>Verkäufer</TableHead>
                <TableHead className="text-right">Preis</TableHead>
                <TableHead>Fahrzeug</TableHead>
                <TableHead>Branding</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {anfragen.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium whitespace-nowrap">{a.vorname} {a.nachname}</TableCell>
                  <TableCell>{a.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{a.telefon}</TableCell>
                  <TableCell className="text-gray-500">{truncate(a.nachricht)}</TableCell>
                  <TableCell className="whitespace-nowrap">{a.verkaeufer_name}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatPrice(a.fahrzeug_preis)} €</TableCell>
                  <TableCell className="whitespace-nowrap">{a.fahrzeug_name}</TableCell>
                  <TableCell>{a.branding_name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
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
