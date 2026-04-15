

## Inzahlungnahme: 5-spaltiger Footer ohne Leistungshinweis

### Footer-Visualisierung

```text
─────────────────────────────────────────────────────────────────────
So erreichen       Vorstand:            USt-IdNr.:        Bankverbindung     Sitz der
Sie uns:            Gernot Döllner       DE811115368       Audi AG Bank       Gesellschaft:
Audi AG             (Vorsitzender),      Amtsgericht       IBAN: DE72 3702    Auto-Union-
Vertrieb            Geoffrey Bouquot,    Ingolstadt        0500 0001 0379 00  Straße 1
Auto-Union-         Jürgen Ritters-      HR B 1            BIC: AUIDE71XXX    85057
Straße 1            berger, Javier                                            Ingolstadt
85057               Ros Hernández,
Ingolstadt          Marco Schubert,
                    Renate
                    Vachenauer,
                    Gerd Walker
─────────────────────────────────────────────────────────────────────
```

**Entfernt:** Telefonnummer "Fon: 0841 9591 4053" und Text "Die Leistung wird nach vollständiger Bezahlung erbracht (§14 Abs. 1 UStG)"

### Aenderungen in `src/pages/AdminInzahlungnahme.tsx`

- Footer-Bereich (Zeilen 240-252) komplett ersetzen
- 5 Spalten mit `doc.text()` an festen X-Positionen (ca. marginL, +34, +68, +102, +136)
- Jede Spalte mit Titel (bold) und Detailzeilen (normal), Schriftgroesse 6-6.5pt
- Trennlinie darueber beibehalten
- Kein Leistungshinweis, keine Telefonnummer

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | 5-spaltiger Footer ohne Leistungstext und ohne Telefonnummer |

