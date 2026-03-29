

## /fahrzeugbestand dynamisch machen mit Seller-Slug

### Konzept
Die Seite `/fahrzeugbestand` wird um eine optionale Route `/fahrzeugbestand/:sellerSlug` erweitert. Wenn ein `sellerSlug` vorhanden ist, werden nur die Fahrzeuge dieses Verkaufers angezeigt, zusammen mit dessen Branding und Beraterdaten. Ohne Slug bleibt das bisherige Verhalten (alle Fahrzeuge).

### Änderungen

**1. `src/App.tsx` -- Neue Route hinzufugen:**
- `<Route path="/fahrzeugbestand/:sellerSlug" element={<Fahrzeugbestand />} />` unterhalb der bestehenden `/fahrzeugbestand`-Route

**2. `src/pages/Fahrzeugbestand.tsx` -- Dynamische Datenladung:**
- `useParams()` importieren und `sellerSlug` extrahieren
- Wenn `sellerSlug` vorhanden:
  - Verkaufer per `vorname`/`nachname` aus Slug finden (wie in Gebrauchtwagen: `split("_")`, `ilike`)
  - Branding des Verkaufers laden (`branding_id`)
  - Nur die dem Verkaufer zugewiesenen Fahrzeuge laden (uber `verkaeufer_fahrzeuge`)
  - Header zeigt Branding-Name und Berater-Info des spezifischen Verkaufers
- Ohne `sellerSlug`: bisheriges Verhalten (alle Fahrzeuge, erstes Branding)
- Links in den FahrzeugCards verwenden den aktuellen `sellerSlug` fur die Weiterleitung zu `/gebrauchtwagen/:sellerSlug/:auftragsnummer`

| Datei | Anderung |
|---|---|
| `src/App.tsx` | Route `/fahrzeugbestand/:sellerSlug` hinzufugen |
| `src/pages/Fahrzeugbestand.tsx` | `useParams`, dynamische Datenladung nach Seller-Slug, Branding + Berater dynamisch |

