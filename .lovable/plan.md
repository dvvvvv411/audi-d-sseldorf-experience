

## Notizen-Button + Popup in der Anfragen-Tabelle

### Konzept
Neben dem Auge-Button (Detail-Ansicht) wird ein neuer Button mit `StickyNote`-Icon eingefügt. Beim Klick öffnet sich ein Dialog/Popup, das die vorhandenen Notizen der Anfrage anzeigt und ein Textfeld zum Hinzufügen/Bearbeiten bietet. Die Notizen werden direkt aus dem `notizen`-Feld der `anfragen`-Tabelle gelesen und dort gespeichert.

### Änderungen in `src/pages/AdminAnfragen.tsx`

1. **Interface erweitern**: `notizen: string | null` zum `Anfrage`-Interface hinzufügen
2. **State für Popup**: `selectedAnfrage` (welche Anfrage offen ist), `notizenText` (aktueller Text), `saving` (Speicherstatus)
3. **Notizen-Button**: Neben dem Eye-Button ein `StickyNote`-Icon-Button einfügen. Falls Notizen vorhanden, visueller Indikator (z.B. andere Farbe)
4. **Dialog-Popup**: Zeigt bestehende Notizen an, Textarea zum Bearbeiten, Speichern-Button. Nach Speichern wird der lokale State aktualisiert
5. **Speichern**: `supabase.from("anfragen").update({ notizen }).eq("id", id)` — gleiche Logik wie in AdminAnfrageDetail

### Spalte in Tabelle
Die letzte Spalte (`w-12`) wird breiter (`w-24`), um beide Buttons nebeneinander zu zeigen.

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | Notizen-Button + Dialog hinzufügen, Interface erweitern, Speicherlogik |

