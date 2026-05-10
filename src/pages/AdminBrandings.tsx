import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Loader2, Building2 } from "lucide-react";

type Branding = {
  id: string;
  name: string;
  strasse: string;
  plz: string;
  stadt: string;
  email: string;
  amtsgericht: string;
  handelsregister: string;
  geschaeftsfuehrer: string;
  ust_id: string;
};

const AdminBrandings = () => {
  const navigate = useNavigate();
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrandings = async () => {
    setLoading(true);
    const { data } = await supabase.from("brandings").select("*").order("created_at", { ascending: false });
    if (data) setBrandings(data as Branding[]);
    setLoading(false);
  };

  useEffect(() => { fetchBrandings(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("brandings").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Branding gelöscht");
    fetchBrandings();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{brandings.length} Brandings</p>
        <Button onClick={() => navigate("/admin/brandings/neu")} className="bg-black text-white hover:bg-gray-800 gap-2">
          <Plus className="w-4 h-4" /> Branding hinzufügen
        </Button>
      </div>

      {brandings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Noch keine Brandings angelegt</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {brandings.map((b) => (
            <div key={b.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <p className="font-bold text-gray-900 text-lg">{b.name}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/brandings/${b.id}/bearbeiten`)} className="text-gray-400 hover:text-gray-900">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium">
                  {b.stadt}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
                <div><span className="text-gray-400">E-Mail:</span> <span className="text-gray-700">{b.email}</span></div>
                <div><span className="text-gray-400">GF:</span> <span className="text-gray-700">{b.geschaeftsfuehrer}</span></div>
                <div><span className="text-gray-400">AG:</span> <span className="text-gray-700">{b.amtsgericht}</span></div>
                <div><span className="text-gray-400">HRB:</span> <span className="text-gray-700">{b.handelsregister}</span></div>
                <div><span className="text-gray-400">USt-IdNr:</span> <span className="text-gray-700">{b.ust_id}</span></div>
              </div>
              <div className="text-right text-xs text-gray-400">
                {b.strasse}, {b.plz} {b.stadt}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AdminBrandings;
