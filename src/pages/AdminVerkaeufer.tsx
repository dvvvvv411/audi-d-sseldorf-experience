import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Mail, Phone, Trash2, Pencil, Loader2, Upload, User } from "lucide-react";

type Branding = { id: string; name: string };
type Verkaeufer = {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon: string;
  avatar_url: string | null;
  branding_id: string | null;
  brandings?: Branding | null;
};

const AdminVerkaeufer = () => {
  const [verkaeufer, setVerkaeufer] = useState<Verkaeufer[]>([]);
  const [brandings, setBrandings] = useState<Branding[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", telefon: "", branding_id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [vRes, bRes] = await Promise.all([
      supabase.from("verkaeufer").select("*, brandings(id, name)").order("created_at", { ascending: false }),
      supabase.from("brandings").select("id, name").order("name"),
    ]);
    if (vRes.data) setVerkaeufer(vRes.data as Verkaeufer[]);
    if (bRes.data) setBrandings(bRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ vorname: "", nachname: "", email: "", telefon: "", branding_id: "" });
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditId(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };

  const openEdit = (v: Verkaeufer) => {
    setForm({
      vorname: v.vorname,
      nachname: v.nachname,
      email: v.email,
      telefon: v.telefon,
      branding_id: v.branding_id ?? "",
    });
    setAvatarPreview(v.avatar_url);
    setAvatarFile(null);
    setEditId(v.id);
    setDialogOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (error) { toast.error("Avatar-Upload fehlgeschlagen"); return null; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.vorname || !form.nachname || !form.email || !form.telefon) {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    setSaving(true);

    let avatar_url: string | null | undefined;
    if (avatarFile) {
      avatar_url = await uploadAvatar(avatarFile);
      if (avatar_url === null) { setSaving(false); return; }
    }

    const payload: Record<string, unknown> = {
      vorname: form.vorname.trim(),
      nachname: form.nachname.trim(),
      email: form.email.trim(),
      telefon: form.telefon.trim(),
      branding_id: form.branding_id || null,
    };
    if (avatar_url !== undefined) payload.avatar_url = avatar_url;

    let error;
    if (editId) {
      ({ error } = await supabase.from("verkaeufer").update(payload).eq("id", editId));
    } else {
      if (!avatar_url) payload.avatar_url = null;
      ({ error } = await supabase.from("verkaeufer").insert(payload));
    }

    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editId ? "Verkäufer aktualisiert" : "Verkäufer hinzugefügt");
    setDialogOpen(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("verkaeufer").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Verkäufer gelöscht");
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{verkaeufer.length} Verkäufer</p>
        <Button onClick={openCreate} className="bg-black text-white hover:bg-gray-800 gap-2">
          <Plus className="w-4 h-4" /> Verkäufer hinzufügen
        </Button>
      </div>

      {verkaeufer.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Noch keine Verkäufer angelegt</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verkaeufer.map((v) => (
            <div key={v.id} className="bg-white border border-gray-200 p-5 flex flex-col gap-3">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {v.avatar_url ? (
                    <img src={v.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{v.vorname} {v.nachname}</p>
                  {v.brandings && (
                    <p className="text-xs text-gray-400 truncate">{v.brandings.name}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{v.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{v.telefon}</span></div>
              </div>
              <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                <Button variant="ghost" size="sm" onClick={() => openEdit(v)} className="text-gray-500 hover:text-gray-900">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)} className="text-gray-500 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Verkäufer bearbeiten" : "Verkäufer hinzufügen"}</DialogTitle>
            <DialogDescription>Geben Sie die Daten des Verkäufers ein.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7 text-gray-400" />
                )}
              </div>
              <label className="cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                <span className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-2 rounded-md">
                  <Upload className="w-4 h-4" /> Bild wählen
                </span>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Vorname *</Label>
                <Input value={form.vorname} onChange={(e) => setForm({ ...form, vorname: e.target.value })} className="bg-gray-50 border-gray-200" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Nachname *</Label>
                <Input value={form.nachname} onChange={(e) => setForm({ ...form, nachname: e.target.value })} className="bg-gray-50 border-gray-200" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">E-Mail *</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Telefon *</Label>
              <Input value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} className="bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Branding</Label>
              <Select value={form.branding_id} onValueChange={(v) => setForm({ ...form, branding_id: v })}>
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Branding wählen (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {brandings.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

export default AdminVerkaeufer;
