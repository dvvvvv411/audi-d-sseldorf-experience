import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
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
  resend_api_key: string | null;
  email_absender: string | null;
  absendername: string | null;
  sevenio_absendername: string | null;
};

const emptyForm = {
  name: "", strasse: "", plz: "", stadt: "", email: "",
  amtsgericht: "", handelsregister: "", geschaeftsfuehrer: "", ust_id: "",
  resend_api_key: "", email_absender: "", absendername: "", sevenio_absendername: "",
};

const AdminBrandings = () => {
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBrandings = async () => {
    setLoading(true);
    const { data } = await supabase.from("brandings").select("*").order("created_at", { ascending: false });
    if (data) setBrandings(data as Branding[]);
    setLoading(false);
  };

  useEffect(() => { fetchBrandings(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditId(null); };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (b: Branding) => {
    setForm({
      name: b.name,
      strasse: b.strasse,
      plz: b.plz,
      stadt: b.stadt,
      email: b.email,
      amtsgericht: b.amtsgericht,
      handelsregister: b.handelsregister,
      geschaeftsfuehrer: b.geschaeftsfuehrer,
      ust_id: b.ust_id,
      resend_api_key: b.resend_api_key ?? "",
      email_absender: b.email_absender ?? "",
      absendername: b.absendername ?? "",
      sevenio_absendername: b.sevenio_absendername ?? "",
    });
    setEditId(b.id);
    setDialogOpen(true);
  };

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.name || !form.strasse || !form.plz || !form.stadt || !form.email || !form.amtsgericht || !form.handelsregister || !form.geschaeftsfuehrer || !form.ust_id) {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    if (form.sevenio_absendername && form.sevenio_absendername.length > 11) {
      toast.error("Seven.io Absendername darf max. 11 Zeichen haben");
      return;
    }
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      strasse: form.strasse.trim(),
      plz: form.plz.trim(),
      stadt: form.stadt.trim(),
      email: form.email.trim(),
      amtsgericht: form.amtsgericht.trim(),
      handelsregister: form.handelsregister.trim(),
      geschaeftsfuehrer: form.geschaeftsfuehrer.trim(),
      ust_id: form.ust_id.trim(),
      resend_api_key: form.resend_api_key.trim() || null,
      email_absender: form.email_absender.trim() || null,
      absendername: form.absendername.trim() || null,
      sevenio_absendername: form.sevenio_absendername.trim() || null,
    };

    let error;
    if (editId) {
      ({ error } = await supabase.from("brandings").update(payload).eq("id", editId));
    } else {
      ({ error } = await supabase.from("brandings").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Branding aktualisiert" : "Branding hinzugefügt");
    setDialogOpen(false);
    resetForm();
    fetchBrandings();
  };

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
        <Button onClick={openCreate} className="bg-black text-white hover:bg-gray-800 gap-2">
          <Plus className="w-4 h-4" /> Branding hinzufügen
        </Button>
      </div>

      {brandings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Noch keine Brandings angelegt</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {brandings.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{b.name}</p>
                  <p className="text-sm text-gray-500">{b.strasse}, {b.plz} {b.stadt}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)} className="text-gray-500 hover:text-gray-900">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(b.id)} className="text-gray-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                <div><span className="text-gray-400">E-Mail:</span> <span className="text-gray-700">{b.email}</span></div>
                <div><span className="text-gray-400">GF:</span> <span className="text-gray-700">{b.geschaeftsfuehrer}</span></div>
                <div><span className="text-gray-400">AG:</span> <span className="text-gray-700">{b.amtsgericht}</span></div>
                <div><span className="text-gray-400">HRB:</span> <span className="text-gray-700">{b.handelsregister}</span></div>
                <div><span className="text-gray-400">USt-IdNr:</span> <span className="text-gray-700">{b.ust_id}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Branding bearbeiten" : "Branding hinzufügen"}</DialogTitle>
            <DialogDescription>Geben Sie die Unternehmensdaten ein.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Unternehmensname *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-gray-50 border-gray-200" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1.5">
                <Label className="text-gray-700 text-sm">Straße + Nr. *</Label>
                <Input value={form.strasse} onChange={(e) => set("strasse", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">PLZ *</Label>
                <Input value={form.plz} onChange={(e) => set("plz", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Stadt *</Label>
                <Input value={form.stadt} onChange={(e) => set("stadt", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">E-Mail *</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Amtsgericht *</Label>
                <Input value={form.amtsgericht} onChange={(e) => set("amtsgericht", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Handelsregister *</Label>
                <Input value={form.handelsregister} onChange={(e) => set("handelsregister", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Geschäftsführer *</Label>
                <Input value={form.geschaeftsfuehrer} onChange={(e) => set("geschaeftsfuehrer", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">USt-IdNr. *</Label>
                <Input value={form.ust_id} onChange={(e) => set("ust_id", e.target.value)} className="bg-gray-50 border-gray-200" />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Optional — E-Mail (Resend)</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Resend API-Key</Label>
                  <Input value={form.resend_api_key} onChange={(e) => set("resend_api_key", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="re_..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">E-Mail Absender</Label>
                    <Input value={form.email_absender} onChange={(e) => set("email_absender", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="info@example.com" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-gray-700 text-sm">Absendername</Label>
                    <Input value={form.absendername} onChange={(e) => set("absendername", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="Audi Düsseldorf" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Optional — SMS (Seven.io)</p>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Absendername (max. 11 Zeichen)</Label>
                <Input
                  value={form.sevenio_absendername}
                  onChange={(e) => set("sevenio_absendername", e.target.value)}
                  maxLength={11}
                  className="bg-gray-50 border-gray-200"
                  placeholder="AudiDUS"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? "Speichern" : "Hinzufügen"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminBrandings;
