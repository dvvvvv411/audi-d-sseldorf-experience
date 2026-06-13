## Meta Pixel auf Gebrauchtwagen-Detailseite wieder aktivieren (seller-gebunden)

Auf `/gebrauchtwagen/:sellerSlug/:auftragsnummer` ist der Verkäufer aus der URL bekannt und über `verkaeufer[0].branding` ist auch das Branding bereits geladen. Der Meta Pixel soll daher dort wieder feuern — aber nur an das Branding des jeweiligen Verkäufers gebunden.

### Änderung

**`src/pages/Gebrauchtwagen.tsx`**
1. Import wieder hinzufügen:
   ```ts
   import { useMetaPixel } from "@/hooks/useMetaPixel";
   ```
2. Innerhalb der Komponente (nach dem Laden von `verkaeufer`):
   ```ts
   const sellerBranding = verkaeufer[0]?.branding as any;
   useMetaPixel(
     sellerSlug ? sellerBranding?.meta_pixel_code : null,
     sellerSlug ? sellerBranding?.meta_pixel_aktiv : false
   );
   ```

### Verhalten danach
- `/gebrauchtwagen/:sellerSlug/:auftragsnummer` → Meta Pixel des zugewiesenen Verkäufer-Brandings feuert.
- `/fahrzeugbestand/:sellerSlug` → unverändert, feuert bereits.
- `/fahrzeugbestand` (ohne Slug) → kein Pixel.

Keine weiteren Dateien betroffen.