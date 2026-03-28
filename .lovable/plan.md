

## Mobile Sidebar optimieren

### Probleme
Die Sidebar nutzt aktuell das Standard-Sheet mit dunklem X-Button und hat kein optimiertes Mobile-Layout. Auf 390px Breite wirkt der Inhalt gedraengt.

### Aenderungen in `src/pages/Gebrauchtwagen.tsx` (Zeilen 262-343)

**Layout-Verbesserungen:**
- `SheetContent`: Padding optimieren (`p-6`), volle Breite auf Mobile (`w-full sm:max-w-md`)
- Ansprechpartner-Bereich: Avatar zentriert oben, Name und Kontaktdaten darunter (zentriertes Layout statt horizontal nebeneinander)
- "Anrufen"-Button: volle Breite, groesser (`py-3`)
- Trennlinie (`border-t`) zwischen Ansprechpartner und den blauen Cards
- Blaue Cards: Padding auf `p-5` reduzieren, `rounded-xl` fuer weicheren Look
- `space-y-5` statt `space-y-6` fuer kompaktere Abstände

**Visuelles:**
- SheetTitle zentriert statt links
- Avatar groesser auf `w-16 h-16`
- Name und Kontaktdaten zentriert unter Avatar
- Kleine Separator-Linie zwischen Sektionen

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Zeilen 262-343: Sidebar-Layout fuer Mobile optimieren |

