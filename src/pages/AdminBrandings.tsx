import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Loader2, Building2, Upload, X } from "lucide-react";

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
  sevenio_api_key: string | null;
  meta_pixel_aktiv: boolean | null;
  meta_pixel_code: string | null;
  logo_pdf_url: string | null;
  marketing_image_url: string | null;
  email_logo_url: string | null;
  footer_unternehmensname: string | null;
  vorstand: string[] | null;
  originallink: string | null;
  eigene_domain: string | null;
};

const emptyForm = {
  name: "", strasse: "", plz: "", stadt: "", email: "",
  amtsgericht: "", handelsregister: "", geschaeftsfuehrer: "", ust_id: "",
  resend_api_key: "", email_absender: "", absendername: "", sevenio_absendername: "",
  sevenio_api_key: "",
  meta_pixel_aktiv: false,
  meta_pixel_code: "",
  logo_pdf_url: "",
  marketing_image_url: "",
  email_logo_url: "",
  footer_unternehmensname: "",
  vorstand: [] as string[],
  originallink: "",
  eigene_domain: "",
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
      sevenio_api_key: b.sevenio_api_key ?? "",
      meta_pixel_aktiv: b.meta_pixel_aktiv ?? false,
      meta_pixel_code: b.meta_pixel_code ?? "",
      logo_pdf_url: b.logo_pdf_url ?? "",
      marketing_image_url: b.marketing_image_url ?? "",
      email_logo_url: b.email_logo_url ?? "",
      footer_unternehmensname: b.footer_unternehmensname ?? "",
      vorstand: Array.isArray(b.vorstand) ? b.vorstand : [],
      originallink: b.originallink ?? "",
      eigene_domain: b.eigene_domain ?? "",
    });
    setEditId(b.id);
    setDialogOpen(true);
  };

  const set = (key: string, value: string | boolean | string[]) => setForm((f) => ({ ...f, [key]: value }));

  const [uploading, setUploading] = useState<"logo" | "marketing" | null>(null);

  const uploadFile = async (kind: "logo" | "marketing", file: File) => {
    setUploading(kind);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("branding-assets").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || undefined,
    });
    if (error) {
      toast.error("Upload fehlgeschlagen: " + error.message);
      setUploading(null);
      return;
    }
    const { data } = supabase.storage.from("branding-assets").getPublicUrl(path);
    if (kind === "logo") set("logo_pdf_url", data.publicUrl);
    else set("marketing_image_url", data.publicUrl);
    setUploading(null);
  };

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
      sevenio_api_key: form.sevenio_api_key.trim() || null,
      meta_pixel_aktiv: !!form.meta_pixel_aktiv,
      meta_pixel_code: form.meta_pixel_aktiv ? (form.meta_pixel_code.trim() || null) : null,
      logo_pdf_url: form.logo_pdf_url.trim() || null,
      marketing_image_url: form.marketing_image_url.trim() || null,
      email_logo_url: form.email_logo_url.trim() || null,
      footer_unternehmensname: form.footer_unternehmensname.trim() || null,
      vorstand: (form.vorstand || []).map((s) => s.trim()).filter(Boolean),
      originallink: form.originallink.trim() || null,
      eigene_domain: form.eigene_domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "") || null,
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
        <div className="grid grid-cols-1 gap-4">
          {brandings.map((b) => (
            <div key={b.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <p className="font-bold text-gray-900 text-lg">{b.name}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(b)} className="text-gray-400 hover:text-gray-900">
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
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Logos & Bilder</p>
              <div className="space-y-4">
                {/* Logo PDF + Fahrzeugbestand */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Logo für PDFs & Fahrzeugbestand</Label>
                  <div className="flex items-center gap-3">
                    {form.logo_pdf_url ? (
                      <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2">
                        <img src={form.logo_pdf_url} alt="" className="h-8 w-auto object-contain" />
                        <Button type="button" variant="ghost" size="sm" onClick={() => set("logo_pdf_url", "")} className="h-6 w-6 p-0 text-gray-400 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : null}
                    <label className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                      {uploading === "logo" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{form.logo_pdf_url ? "Ersetzen" : "Hochladen"}</span>
                      <input
                        type="file"
                        accept="image/svg+xml,image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("logo", f); e.target.value = ""; }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">SVG bevorzugt. Wird im Header der Fahrzeugbestand-Seite, im Loader sowie als Logo in PDFs (Exposé, Angebot, Inzahlungnahme) genutzt.</p>
                </div>

                {/* Marketing Image */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Marketing-Bild (Angebots-PDF)</Label>
                  <div className="flex items-center gap-3">
                    {form.marketing_image_url ? (
                      <div className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2">
                        <img src={form.marketing_image_url} alt="" className="h-12 w-auto object-contain" />
                        <Button type="button" variant="ghost" size="sm" onClick={() => set("marketing_image_url", "")} className="h-6 w-6 p-0 text-gray-400 hover:text-red-600">
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    ) : null}
                    <label className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer">
                      {uploading === "marketing" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{form.marketing_image_url ? "Ersetzen" : "Hochladen"}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("marketing", f); e.target.value = ""; }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-400">JPG/PNG. Wird im Angebots-PDF unter dem Fahrzeug eingebunden (z. B. „Gebrauchtwagen :plus").</p>
                </div>

                {/* Email Logo URL */}
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Externes Logo für E-Mails (URL)</Label>
                  <Input
                    value={form.email_logo_url}
                    onChange={(e) => set("email_logo_url", e.target.value)}
                    className="bg-gray-50 border-gray-200"
                    placeholder="https://example.com/logo.svg"
                  />
                  <p className="text-xs text-gray-400">Öffentlich erreichbare URL. Wird in den HTML-E-Mails (Resend) als Logo eingebunden.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Footer</p>
              <div className="space-y-1.5">
                <Label className="text-gray-700 text-sm">Footer-Unternehmensname</Label>
                <Input
                  value={form.footer_unternehmensname}
                  onChange={(e) => set("footer_unternehmensname", e.target.value)}
                  className="bg-gray-50 border-gray-200"
                  placeholder="z. B. AUDI AG"
                />
                <p className="text-xs text-gray-400">Wird im Footer (© ... Alle Rechte vorbehalten) und in den Rechtstexten verwendet.</p>
              </div>
            </div>

            {/* Vorstand */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Vorstand</p>
              <p className="text-xs text-gray-500 mb-2">
                Vorsitzender wird automatisch aus dem oben hinterlegten <span className="font-medium">Geschäftsführer</span> übernommen.
                Hier nur die weiteren Mitglieder eintragen.
              </p>
              <div className="space-y-2">
                {(form.vorstand || []).map((mitglied, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={mitglied}
                      onChange={(e) => {
                        const next = [...form.vorstand];
                        next[i] = e.target.value;
                        set("vorstand", next);
                      }}
                      className="bg-gray-50 border-gray-200"
                      placeholder="Name des Vorstandsmitglieds"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => set("vorstand", form.vorstand.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-600 h-9 w-9 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("vorstand", [...(form.vorstand || []), ""])}
                  className="gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Mitglied hinzufügen
                </Button>
              </div>
            </div>

            {/* Domains & Weiterleitung */}
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Domains & Weiterleitung</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Originallink (Weiterleitungsziel)</Label>
                  <Input
                    value={form.originallink}
                    onChange={(e) => set("originallink", e.target.value)}
                    className="bg-gray-50 border-gray-200"
                    placeholder="https://audi.de"
                  />
                  <p className="text-xs text-gray-400">Wenn Besucher auf der Wurzel-URL (/) landen, werden sie hierhin weitergeleitet.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Eigene Domain</Label>
                  <Input
                    value={form.eigene_domain}
                    onChange={(e) => set("eigene_domain", e.target.value)}
                    className="bg-gray-50 border-gray-200"
                    placeholder="berlin-audi-zentrum.de"
                  />
                  <p className="text-xs text-gray-400">Hostname (ohne https://). Anhand dieser Domain wird das aktive Branding für die Landingpage und Rechtstexte erkannt.</p>
                </div>
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
              <div className="space-y-3">
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
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Seven.io API-Key</Label>
                  <Input
                    value={form.sevenio_api_key}
                    onChange={(e) => set("sevenio_api_key", e.target.value)}
                    className="bg-gray-50 border-gray-200 font-mono text-xs"
                    placeholder="z.B. SVKxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Optional — Meta Pixel</p>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-700 text-sm">Aktivieren</Label>
                  <Switch
                    checked={!!form.meta_pixel_aktiv}
                    onCheckedChange={(v) => set("meta_pixel_aktiv", v)}
                  />
                </div>
              </div>
              {form.meta_pixel_aktiv && (
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Meta Pixel Code (kompletter Snippet)</Label>
                  <Textarea
                    value={form.meta_pixel_code}
                    onChange={(e) => set("meta_pixel_code", e.target.value)}
                    className="bg-gray-50 border-gray-200 font-mono text-xs min-h-[200px]"
                    placeholder={"<!-- Meta Pixel Code -->\n<script>...</script>\n<noscript>...</noscript>"}
                  />
                  <p className="text-xs text-gray-400">Wird auf den Verkäufer-Seiten dieses Brandings ausgespielt.</p>
                </div>
              )}
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
