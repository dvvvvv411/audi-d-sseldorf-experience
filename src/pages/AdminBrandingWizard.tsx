import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, Upload, X } from "lucide-react";

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

const STEPS = [
  { key: "stamm", label: "Stammdaten" },
  { key: "recht", label: "Rechtliches" },
  { key: "logos", label: "Logos & Bilder" },
  { key: "domain", label: "Domains & Integrationen" },
  { key: "pixel", label: "Pixel & Abschluss" },
];

const AdminBrandingWizard = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const [form, setForm] = useState(emptyForm);
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "marketing" | null>(null);

  const set = (key: string, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const { data, error } = await supabase.from("brandings").select("*").eq("id", id!).single();
      if (error || !data) {
        toast.error("Branding nicht gefunden");
        navigate("/admin/brandings");
        return;
      }
      const b = data as any;
      setForm({
        name: b.name ?? "",
        strasse: b.strasse ?? "",
        plz: b.plz ?? "",
        stadt: b.stadt ?? "",
        email: b.email ?? "",
        amtsgericht: b.amtsgericht ?? "",
        handelsregister: b.handelsregister ?? "",
        geschaeftsfuehrer: b.geschaeftsfuehrer ?? "",
        ust_id: b.ust_id ?? "",
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
      setVisited(new Set([0, 1, 2, 3, 4]));
      setLoading(false);
    })();
  }, [id, isEdit, navigate]);

  const uploadFile = async (kind: "logo" | "marketing", file: File) => {
    setUploading(kind);
    const ext = file.name.split(".").pop() || "bin";
    const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("branding-assets").upload(path, file, {
      cacheControl: "3600", upsert: false, contentType: file.type || undefined,
    });
    if (error) { toast.error("Upload fehlgeschlagen: " + error.message); setUploading(null); return; }
    const { data } = supabase.storage.from("branding-assets").getPublicUrl(path);
    if (kind === "logo") set("logo_pdf_url", data.publicUrl);
    else set("marketing_image_url", data.publicUrl);
    setUploading(null);
  };

  const validateStep = (n: number): string | null => {
    if (n === 0) {
      if (!form.name || !form.strasse || !form.plz || !form.stadt || !form.email)
        return "Bitte alle Pflichtfelder im Schritt Stammdaten ausfüllen";
    }
    if (n === 1) {
      if (!form.amtsgericht || !form.handelsregister || !form.geschaeftsfuehrer || !form.ust_id)
        return "Bitte alle Pflichtfelder im Schritt Rechtliches ausfüllen";
    }
    if (n === 3) {
      if (form.sevenio_absendername && form.sevenio_absendername.length > 11)
        return "Seven.io Absendername darf max. 11 Zeichen haben";
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) { toast.error(err); return; }
    const next = Math.min(step + 1, STEPS.length - 1);
    setStep(next);
    setVisited((v) => new Set(v).add(next));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const jumpTo = (n: number) => {
    if (!visited.has(n)) return;
    setStep(n);
  };

  const handleSave = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      const err = validateStep(i);
      if (err) { setStep(i); toast.error(err); return; }
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
    if (isEdit) ({ error } = await supabase.from("brandings").update(payload).eq("id", id!));
    else ({ error } = await supabase.from("brandings").insert(payload));
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(isEdit ? "Branding aktualisiert" : "Branding hinzugefügt");
    navigate("/admin/brandings");
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate("/admin/brandings")} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-3">
          <ArrowLeft className="w-4 h-4" /> Zurück zur Übersicht
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Branding bearbeiten" : "Branding hinzufügen"}</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => {
          const active = i === step;
          const done = i < step || (visited.has(i) && i !== step && isEdit);
          const reachable = visited.has(i);
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => jumpTo(i)}
                disabled={!reachable}
                className={`flex flex-col items-center gap-1.5 ${reachable ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  active ? "bg-black text-white"
                  : done ? "bg-green-600 text-white"
                  : reachable ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-400"
                }`}>
                  {done && !active ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[11px] font-medium ${active ? "text-gray-900" : "text-gray-500"}`}>{s.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 ${i < step ? "bg-green-600" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {step === 0 && (
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
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
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
            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Footer-Unternehmensname</Label>
              <Input value={form.footer_unternehmensname} onChange={(e) => set("footer_unternehmensname", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="z. B. AUDI AG" />
              <p className="text-xs text-gray-400">Wird im Footer und in den Rechtstexten verwendet.</p>
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Vorstand</p>
              <p className="text-xs text-gray-500 mb-2">
                Vorsitzender wird automatisch aus dem oben hinterlegten <span className="font-medium">Geschäftsführer</span> übernommen.
              </p>
              <div className="space-y-2">
                {(form.vorstand || []).map((m, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input value={m} onChange={(e) => { const next = [...form.vorstand]; next[i] = e.target.value; set("vorstand", next); }} className="bg-gray-50 border-gray-200" placeholder="Name des Vorstandsmitglieds" />
                    <Button type="button" variant="ghost" size="sm" onClick={() => set("vorstand", form.vorstand.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-600 h-9 w-9 p-0">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => set("vorstand", [...(form.vorstand || []), ""])} className="gap-2">
                  <Plus className="w-3.5 h-3.5" /> Mitglied hinzufügen
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
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
                  <input type="file" accept="image/svg+xml,image/png,image/jpeg" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("logo", f); e.target.value = ""; }} />
                </label>
              </div>
              <p className="text-xs text-gray-400">SVG bevorzugt. Wird im Header der Fahrzeugbestand-Seite, im Loader und als Logo in PDFs genutzt.</p>
            </div>

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
                  <input type="file" accept="image/png,image/jpeg" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile("marketing", f); e.target.value = ""; }} />
                </label>
              </div>
              <p className="text-xs text-gray-400">JPG/PNG. Wird im Angebots-PDF unter dem Fahrzeug eingebunden.</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-gray-700 text-sm">Externes Logo für E-Mails (URL)</Label>
              <Input value={form.email_logo_url} onChange={(e) => set("email_logo_url", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="https://example.com/logo.svg" />
              <p className="text-xs text-gray-400">Öffentlich erreichbare URL. Wird in den HTML-E-Mails (Resend) als Logo eingebunden.</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Domains & Weiterleitung</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Originallink (Weiterleitungsziel)</Label>
                  <Input value={form.originallink} onChange={(e) => set("originallink", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="https://audi.de" />
                  <p className="text-xs text-gray-400">Bei / wird hierhin weitergeleitet.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Eigene Domain</Label>
                  <Input value={form.eigene_domain} onChange={(e) => set("eigene_domain", e.target.value)} className="bg-gray-50 border-gray-200" placeholder="berlin-audi-zentrum.de" />
                  <p className="text-xs text-gray-400">Hostname (ohne https://). Erkennt das aktive Branding.</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">E-Mail (Resend)</p>
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
                    <Input value={form.absendername} onChange={(e) => set("absendername", e.target.value)} className="bg-gray-50 border-gray-200" />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">SMS (Seven.io)</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Absendername (max. 11 Zeichen)</Label>
                  <Input value={form.sevenio_absendername} onChange={(e) => set("sevenio_absendername", e.target.value)} maxLength={11} className="bg-gray-50 border-gray-200" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Seven.io API-Key</Label>
                  <Input value={form.sevenio_api_key} onChange={(e) => set("sevenio_api_key", e.target.value)} className="bg-gray-50 border-gray-200 font-mono text-xs" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Meta Pixel</p>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-700 text-sm">Aktivieren</Label>
                  <Switch checked={!!form.meta_pixel_aktiv} onCheckedChange={(v) => set("meta_pixel_aktiv", v)} />
                </div>
              </div>
              {form.meta_pixel_aktiv && (
                <div className="space-y-1.5">
                  <Label className="text-gray-700 text-sm">Meta Pixel Code (kompletter Snippet)</Label>
                  <Textarea value={form.meta_pixel_code} onChange={(e) => set("meta_pixel_code", e.target.value)} className="bg-gray-50 border-gray-200 font-mono text-xs min-h-[200px]"
                    placeholder={"<!-- Meta Pixel Code -->\n<script>...</script>\n<noscript>...</noscript>"} />
                  <p className="text-xs text-gray-400">Wird auf den Verkäufer-Seiten dieses Brandings ausgespielt.</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Zusammenfassung</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div><span className="text-gray-400">Name:</span> <span className="text-gray-900">{form.name || "—"}</span></div>
                <div><span className="text-gray-400">Adresse:</span> <span className="text-gray-900">{form.strasse}, {form.plz} {form.stadt}</span></div>
                <div><span className="text-gray-400">E-Mail:</span> <span className="text-gray-900">{form.email || "—"}</span></div>
                <div><span className="text-gray-400">GF:</span> <span className="text-gray-900">{form.geschaeftsfuehrer || "—"}</span></div>
                <div><span className="text-gray-400">Domain:</span> <span className="text-gray-900">{form.eigene_domain || "—"}</span></div>
                <div><span className="text-gray-400">Pixel:</span> <span className="text-gray-900">{form.meta_pixel_aktiv ? "aktiv" : "inaktiv"}</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" onClick={step === 0 ? () => navigate("/admin/brandings") : goBack} disabled={saving}>
          {step === 0 ? "Abbrechen" : (<><ArrowLeft className="w-4 h-4" /> Zurück</>)}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={goNext} className="bg-black text-white hover:bg-gray-800 gap-2">
            Weiter <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={saving} className="bg-black text-white hover:bg-gray-800">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? "Speichern" : "Hinzufügen"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminBrandingWizard;
