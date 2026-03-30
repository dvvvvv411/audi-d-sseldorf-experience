import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Mail, Phone, Trash2, Pencil, Loader2, Upload, User, Car } from "lucide-react";

type Branding = { id: string; name: string };
type Fahrzeug = { id: string; fahrzeugname: string; preis: number };
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
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Vehicle assignment state
  const [carDialogOpen, setCarDialogOpen] = useState(false);
  const [carDialogVerkaeufer, setCarDialogVerkaeufer] = useState<Verkaeufer | null>(null);
  const [selectedFahrzeuge, setSelectedFahrzeuge] = useState<string[]>([]);
  const [savingCars, setSavingCars] = useState(false);
  const [assignmentCounts, setAssignmentCounts] = useState<Record<string, number>>({});

  const [form, setForm] = useState({
    vorname: "", nachname: "", email: "", telefon: "", branding_id: "",
  });

  const fetchData = async () => {
    setLoading(true);
    const [vRes, bRes, fRes, aRes] = await Promise.all([
      supabase.from("verkaeufer").select("*, brandings(id, name)").order("created_at", { ascending: false }),
      supabase.from("brandings").select("id, name").order("name"),
      supabase.from("fahrzeuge").select("id, fahrzeugname, preis").order("fahrzeugname"),
      supabase.from("verkaeufer_fahrzeuge").select("verkaeufer_id"),
    ]);
    if (vRes.data) setVerkaeufer(vRes.data as Verkaeufer[]);
    if (bRes.data) setBrandings(bRes.data);
    if (fRes.data) setFahrzeuge(fRes.data);

    // Count assignments per seller
    if (aRes.data) {
      const counts: Record<string, number> = {};
      aRes.data.forEach((r: any) => {
        counts[r.verkaeufer_id] = (counts[r.verkaeufer_id] || 0) + 1;
      });
      setAssignmentCounts(counts);
    }
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
      ({ error } = await supabase.from("verkaeufer").insert(payload as any));
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

  // Vehicle assignment
  const openCarDialog = async (v: Verkaeufer) => {
    setCarDialogVerkaeufer(v);
    const { data } = await supabase
      .from("verkaeufer_fahrzeuge")
      .select("fahrzeug_id")
      .eq("verkaeufer_id", v.id);
    setSelectedFahrzeuge(data?.map((r: any) => r.fahrzeug_id) ?? []);
    setCarDialogOpen(true);
  };

  const toggleFahrzeug = (id: string) => {
    setSelectedFahrzeuge((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSaveCars = async () => {
    if (!carDialogVerkaeufer) return;
    setSavingCars(true);
    const vid = carDialogVerkaeufer.id;

    // Delete all existing, then insert selected
    const { error: delErr } = await supabase
      .from("verkaeufer_fahrzeuge")
      .delete()
      .eq("verkaeufer_id", vid);
    if (delErr) { toast.error(delErr.message); setSavingCars(false); return; }

    if (selectedFahrzeuge.length > 0) {
      const rows = selectedFahrzeuge.map((fid) => ({
        verkaeufer_id: vid,
        fahrzeug_id: fid,
      }));
      const { error: insErr } = await supabase
        .from("verkaeufer_fahrzeuge")
        .insert(rows);
      if (insErr) { toast.error(insErr.message); setSavingCars(false); return; }
    }

    toast.success("Fahrzeuge zugewiesen");
    setSavingCars(false);
    setCarDialogOpen(false);
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
        <div className="grid grid-cols-1 gap-4">
          {verkaeufer.map((v) => (
            <div key={v.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {v.avatar_url ? (
                      <img src={v.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 text-lg truncate">{v.vorname} {v.nachname}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openCarDialog(v)} className="text-gray-400 hover:text-gray-900">
                    <Car className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(v)} className="text-gray-400 hover:text-gray-900">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(v.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {v.brandings && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium">
                    {v.brandings.name}
                  </span>
                )}
                {assignmentCounts[v.id] > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium">
                    <Car className="w-3 h-3" />
                    {assignmentCounts[v.id]} Fahrzeug{assignmentCounts[v.id] !== 1 ? "e" : ""}
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="truncate">{v.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{v.telefon}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Verkäufer bearbeiten" : "Verkäufer hinzufügen"}</DialogTitle>
            <DialogDescription>Geben Sie die Daten des Verkäufers ein.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
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

      {/* Vehicle Assignment Dialog */}
      <Dialog open={carDialogOpen} onOpenChange={setCarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fahrzeuge zuweisen</DialogTitle>
            <DialogDescription>
              {carDialogVerkaeufer
                ? `Fahrzeuge für ${carDialogVerkaeufer.vorname} ${carDialogVerkaeufer.nachname} auswählen`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {fahrzeuge.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Keine Fahrzeuge im Bestand</p>
          ) : (
            <ScrollArea className="max-h-[340px]">
              <div className="space-y-2 pr-3">
                {fahrzeuge.map((f) => (
                  <label
                    key={f.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedFahrzeuge.includes(f.id)}
                      onCheckedChange={() => toggleFahrzeug(f.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{f.fahrzeugname}</p>
                      <p className="text-xs text-gray-400">{Number(f.preis).toLocaleString("de-DE")} €</p>
                    </div>
                  </label>
                ))}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCarDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveCars} disabled={savingCars} className="bg-black text-white hover:bg-gray-800">
              {savingCars ? <Loader2 className="w-4 h-4 animate-spin" /> : "Speichern"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminVerkaeufer;
