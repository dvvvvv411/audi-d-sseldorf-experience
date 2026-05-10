import { createClient } from "@supabase/supabase-js";
import fs from "fs";
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const sb = createClient(url, key);

const files = [
  { local: "public/images/Audi.svg", path: "audi/logo.svg", type: "image/svg+xml" },
  { local: "public/images/audi_gwplus.jpg", path: "audi/gwplus.jpg", type: "image/jpeg" },
];
const urls = {};
for (const f of files) {
  const buf = fs.readFileSync(f.local);
  const { error } = await sb.storage.from("branding-assets").upload(f.path, buf, { contentType: f.type, upsert: true });
  if (error) { console.error(f.path, error); process.exit(1); }
  urls[f.path] = sb.storage.from("branding-assets").getPublicUrl(f.path).data.publicUrl;
}
console.log(urls);

const { data: brandings, error: be } = await sb.from("brandings").select("id,name");
if (be) { console.error(be); process.exit(1); }
console.log("brandings:", brandings);
for (const b of brandings) {
  const { error } = await sb.from("brandings").update({
    logo_pdf_url: urls["audi/logo.svg"],
    marketing_image_url: urls["audi/gwplus.jpg"],
    email_logo_url: "https://www.tiemeyer.de/media/uploads/2025/06/Audi.svg",
  }).eq("id", b.id);
  if (error) console.error(b.name, error); else console.log("updated", b.name);
}
