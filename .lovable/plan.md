Verstanden — kein Domain-Fallback, kein Branding-Raten. Die öffentlichen Verkäuferseiten sollen ausschließlich das Branding verwenden, das beim Verkäufer gespeichert ist.

## Plan

1. **`/fahrzeugbestand/:sellerSlug` sauber halten**
   - Das bereits geladene Verkäufer-Branding bleibt die einzige Logo-Quelle.
   - Der `BrandLogo`-Fallback auf das hardcodierte Audi-SVG wird entfernt.
   - Wenn `branding.logo_pdf_url` noch nicht geladen ist oder fehlt, wird kein Audi-Logo angezeigt.

2. **`/gebrauchtwagen/:sellerSlug/:auftragsnummer` korrigieren**
   - Der Loading-Screen mit hardcodiertem Audi-Logo wird durch den neutralen Spinner ersetzt.
   - Das hardcodierte Audi-SVG im Header wird entfernt.
   - Im Header wird stattdessen `verkaeufer[0].branding.logo_pdf_url` gerendert.
   - Der Branding-Name daneben bleibt wie bisher aus `verkaeufer[0].branding.name`.

3. **Kein falsches Logo mehr bei Seitenwechseln**
   - Während Daten laden: neutraler Spinner.
   - Nach dem Laden: exakt das beim Verkäufer hinterlegte Branding-Logo.
   - Kein Audi-Fallback auf öffentlichen Fahrzeugseiten.

## Technische Details

Betroffene Dateien:

```text
src/pages/Fahrzeugbestand.tsx
src/pages/Gebrauchtwagen.tsx
```

Branding-Reihenfolge auf öffentlichen Verkäuferseiten danach:

```text
1. Verkäufer laden
2. branding_id des Verkäufers laden
3. dieses Branding-Logo rendern
4. wenn kein Logo vorhanden ist: leer/neutral, niemals Audi
```

Keine Datenbankänderung nötig.