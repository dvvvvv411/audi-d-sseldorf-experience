

## Inzahlungnahme: 4 Spalten — "So erreichen Sie uns" entfernen, "Sitz der Gesellschaft" behalten

### Footer-Visualisierung (4 Spalten)

```text
─────────────────────────────────────────────────────────────────────
Ihr Berater:            USt-IdNr.:           Bankverbindung        Sitz der
Max Mustermann          DE811115368          Audi AG Bank           Gesellschaft:
Tel: 0123 456789        Amtsgericht          IBAN: DE72 3702       Auto-Union-
E-Mail:                 Ingolstadt           0500 0001 0379 00     Straße 1
max.mustermann@         HR B 1               BIC: AUIDE71XXX       85057
audi.de                                                            Ingolstadt
─────────────────────────────────────────────────────────────────────
```

**Entfernt:** Spalte 1 ("So erreichen Sie uns: Audi AG Vertrieb...")
**Behalten:** Sitz der Gesellschaft als Spalte 4

### Aenderungen in `src/pages/AdminInzahlungnahme.tsx`

- Spalte 1 ("So erreichen Sie uns", Zeilen 249-258) komplett entfernen
- `colX`-Array von 5 auf 4 Positionen: `[marginL, marginL + 42.5, marginL + 85, marginL + 127.5]`
- Verbleibende 4 Spalten: Ihr Berater, USt-IdNr, Bankverbindung, Sitz der Gesellschaft

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | Spalte 1 entfernen, 4-Spalten-Grid mit breiterem Abstand |

