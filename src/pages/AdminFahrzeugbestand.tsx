import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, X, ImagePlus } from "lucide-react";
import { toast } from "sonner";

interface Fahrzeug {
  id: string;
  fahrzeugname: string;
  preis: number;
  farbe: string | null;
  kw: number | null;
  ps: number | null;
  hubraum: number | null;
  km_stand: number | null;
  kraftstoff: string | null;
  getriebe: string | null;
  antrieb: string | null;
  innenausstattung: string | null;
  tueren: number | null;
  sitze: number | null;
  erstzulassung: string | null;
  tuev_au: string | null;
  auftragsnummer: string | null;
  fahrgestellnummer: string | null;
  beschreibung: string | null;
  bilder: string[] | null;
  created_at: string;
}

const emptyForm = {
  fahrzeugname: "",
  preis: "",
  farbe: "",
  kw: "",
  ps: "",
  hubraum: "",
  km_stand: "",
  kraftstoff: "",
  getriebe: "",
  antrieb: "",
  innenausstattung: "",
  tueren: "",
  sitze: "",
  erstzulassung: "",
  tuev_au: "",
  auftragsnummer: "",
  fahrgestellnummer: "",
  beschreibung: "",
};

const AdminFahrzeugbestand = () => {
  const navigate = useNavigate();
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [bilder, setBilder] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFahrzeuge = async () => {
    const { data, error } = await supabase
      .from("fahrzeuge")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Fehler beim Laden der Fahrzeuge");
    } else {
      setFahrzeuge(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFahrzeuge();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setBilder([]);
    setDialogOpen(true);
  };

  const openEdit = (f: Fahrzeug) => {
    setEditingId(f.id);
    setForm({
      fahrzeugname: f.fahrzeugname,
      preis: String(f.preis),
      farbe: f.farbe || "",
      kw: f.kw != null ? String(f.kw) : "",
      ps: f.ps != null ? String(f.ps) : "",
      hubraum: f.hubraum != null ? String(f.hubraum) : "",
      km_stand: f.km_stand != null ? String(f.km_stand) : "",
      kraftstoff: f.kraftstoff || "",
      getriebe: f.getriebe || "",
      antrieb: f.antrieb || "",
      innenausstattung: f.innenausstattung || "",
      tueren: f.tueren != null ? String(f.tueren) : "",
      sitze: f.sitze != null ? String(f.sitze) : "",
      erstzulassung: f.erstzulassung || "",
      tuev_au: f.tuev_au || "",
      auftragsnummer: f.auftragsnummer || "",
      fahrgestellnummer: f.fahrgestellnummer || "",
      beschreibung: f.beschreibung || "",
    });
    setBilder(f.bilder || []);
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("fahrzeuge").upload(path, file);
      if (error) {
        toast.error(`Fehler beim Hochladen: ${file.name}`);
        continue;
      }
      const { data: urlData } = supabase.storage.from("fahrzeuge").getPublicUrl(path);
      newUrls.push(urlData.publicUrl);
    }
    setBilder((prev) => [...prev, ...newUrls]);
    setUploading(false);
    e.target.value = "";
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newBilder = [...bilder];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newBilder.length) return;
    [newBilder[index], newBilder[swapIndex]] = [newBilder[swapIndex], newBilder[index]];
    setBilder(newBilder);
  };

  const removeImage = (index: number) => {
    setBilder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.fahrzeugname || !form.preis) {
      toast.error("Fahrzeugname und Preis sind Pflichtfelder");
      return;
    }
    setSaving(true);
    const payload = {
      fahrzeugname: form.fahrzeugname,
      preis: parseFloat(form.preis),
      farbe: form.farbe || null,
      kw: form.kw ? parseInt(form.kw) : null,
      ps: form.ps ? parseInt(form.ps) : null,
      hubraum: form.hubraum ? parseInt(form.hubraum) : null,
      km_stand: form.km_stand ? parseInt(form.km_stand) : null,
      kraftstoff: form.kraftstoff || null,
      getriebe: form.getriebe || null,
      antrieb: form.antrieb || null,
      innenausstattung: form.innenausstattung || null,
      tueren: form.tueren ? parseInt(form.tueren) : null,
      sitze: form.sitze ? parseInt(form.sitze) : null,
      erstzulassung: form.erstzulassung || null,
      tuev_au: form.tuev_au || null,
      auftragsnummer: form.auftragsnummer || null,
      fahrgestellnummer: form.fahrgestellnummer || null,
      beschreibung: form.beschreibung || null,
      bilder,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("fahrzeuge").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("fahrzeuge").insert(payload));
    }

    if (error) {
      toast.error("Fehler beim Speichern");
    } else {
      toast.success(editingId ? "Fahrzeug aktualisiert" : "Fahrzeug hinzugefügt");
      setDialogOpen(false);
      fetchFahrzeuge();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Fahrzeug wirklich löschen?")) return;
    const { error } = await supabase.from("fahrzeuge").delete().eq("id", id);
    if (error) {
      toast.error("Fehler beim Löschen");
    } else {
      toast.success("Fahrzeug gelöscht");
      fetchFahrzeuge();
    }
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: 0 }).format(p);

  const formatKm = (km: number | null) =>
    km != null ? new Intl.NumberFormat("de-DE").format(km) + " km" : "–";

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <Label className="text-gray-700 text-sm">{label}</Label>
      <Input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        placeholder={placeholder}
        className="bg-gray-50 border-gray-200 text-gray-900 mt-1"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fahrzeugbestand</h2>
          <p className="text-gray-500 text-sm mt-1">{fahrzeuge.length} Fahrzeuge</p>
        </div>
        <Button onClick={openAdd} className="bg-black text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" /> Fahrzeug hinzufügen
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Laden…</p>
      ) : fahrzeuge.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Noch keine Fahrzeuge vorhanden</p>
          <p className="text-sm mt-1">Füge dein erstes Fahrzeug hinzu.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-16">Bild</TableHead>
                <TableHead>Fahrzeug</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>km-Stand</TableHead>
                <TableHead>EZ</TableHead>
                <TableHead>Kraftstoff</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fahrzeuge.map((f) => (
                <TableRow key={f.id} onClick={() => navigate(`/admin/fahrzeugbestand/${f.id}`)} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    {f.bilder && f.bilder.length > 0 ? (
                      <img src={f.bilder[0]} alt="" className="w-12 h-9 object-cover rounded" />
                    ) : (
                      <div className="w-12 h-9 bg-gray-100 rounded flex items-center justify-center">
                        <ImagePlus className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{f.fahrzeugname}</TableCell>
                  <TableCell className="text-gray-700">{formatPrice(f.preis)}</TableCell>
                  <TableCell className="text-gray-600">{formatKm(f.km_stand)}</TableCell>
                  <TableCell className="text-gray-600">{f.erstzulassung || "–"}</TableCell>
                  <TableCell className="text-gray-600">{f.kraftstoff || "–"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(f)} className="text-gray-500 hover:text-gray-900">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(f.id)} className="text-gray-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {editingId ? "Fahrzeug bearbeiten" : "Fahrzeug hinzufügen"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Bilder */}
            <div>
              <Label className="text-gray-700 text-sm font-semibold">Bilder</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {bilder.map((url, i) => (
                  <div key={i} className="relative group w-28 h-20">
                    <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-gray-200" />
                    <div className="absolute top-0 right-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => moveImage(i, "up")}
                        disabled={i === 0}
                        className="bg-white/90 rounded p-0.5 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveImage(i, "down")}
                        disabled={i === bilder.length - 1}
                        className="bg-white/90 rounded p-0.5 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="bg-white/90 rounded p-0.5 text-red-500 hover:text-red-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                <label className="w-28 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                  <ImagePlus className="w-5 h-5 text-gray-400" />
                  <span className="text-xs text-gray-400 mt-1">{uploading ? "Laden…" : "Bilder"}</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Fahrzeugname */}
            {field("Fahrzeugname *", "fahrzeugname", "text", "z.B. A7 Sportback 55 TFSI Q S LINE")}

            {/* Fahrzeugdaten */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Fahrzeugdaten</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {field("Preis (€) *", "preis", "number", "34260")}
                {field("Farbe", "farbe", "text", "Vesuvgrau Metallic")}
                {field("kW", "kw", "number", "250")}
                {field("PS", "ps", "number", "340")}
                {field("Hubraum (ccm)", "hubraum", "number", "2995")}
                {field("km-Stand", "km_stand", "number", "133500")}
                {field("Kraftstoff", "kraftstoff", "text", "Benzin")}
                {field("Getriebe", "getriebe", "text", "Automatik")}
                {field("Antrieb", "antrieb", "text", "Allradantrieb")}
                {field("Innenausstattung", "innenausstattung", "text", "Leder")}
                {field("Türen", "tueren", "number", "5")}
                {field("Sitze", "sitze", "number", "4")}
                {field("Erstzulassung", "erstzulassung", "text", "21.03.2018")}
                {field("TÜV/AU", "tuev_au", "text", "04.2027/04.2027")}
                {field("Auftragsnummer", "auftragsnummer", "text", "116528")}
                {field("Fahrgestellnummer", "fahrgestellnummer", "text", "WAUZZZF20KN004336")}
              </div>
            </div>

            {/* Beschreibung */}
            <div>
              <Label className="text-gray-700 text-sm font-semibold">Serien- und Sonderausstattung</Label>
              <Textarea
                value={form.beschreibung}
                onChange={(e) => setForm({ ...form, beschreibung: e.target.value })}
                placeholder="Ausstattungsdetails eingeben…"
                rows={8}
                className="bg-gray-50 border-gray-200 text-gray-900 mt-1"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
                {saving ? "Speichern…" : editingId ? "Aktualisieren" : "Hinzufügen"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFahrzeugbestand;
