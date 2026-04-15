

## Inzahlungnahme: Footer-Abstände und Schriftgröße optimieren

### Visualisierung (4 Spalten, gleichmäßig verteilt)

```text
─────────────────────────────────────────────────────────────────────
Ihr Berater:         USt-IdNr.:          Bankverbindung       Sitz der
Max Mustermann       DE811115368         Audi AG Bank          Gesellschaft:
Tel: 0123 456789     Amtsgericht         IBAN: DE72 3702      Auto-Union-
E-Mail:              Ingolstadt          0500 0001 0379 00    Straße 1
max@audi.de          HR B 1              BIC: AUIDE71XXX      85057 Ingolstadt
─────────────────────────────────────────────────────────────────────
```

### Änderungen in `src/pages/AdminInzahlungnahme.tsx`

- **Schriftgröße** von 6pt auf 7pt erhöhen
- **Zeilenhöhe** (`fLineH`) von 3 auf 3.5 anpassen
- **Spaltenabstände** gleichmäßiger verteilen: `colX = [marginL, marginL + 45, marginL + 90, marginL + 135]`
- Spalte 4 "Sitz der Gesellschaft:" in eine Zeile zusammenfassen (Platz reicht bei 7pt)

### Dateien

| Datei | Änderung |
|---|---|
| `src/pages/AdminInzahlungnahme.tsx` | Footer: Schrift 7pt, Zeilenhöhe 3.5, breitere Spaltenverteilung |

