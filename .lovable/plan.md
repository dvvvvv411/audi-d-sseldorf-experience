

## Header Redesign — Modern & Premium Audi-Look

### Aktuelles Problem
Der Header ist zu simpel: nur eine Zeile mit Logo, Standort, Beratername — sieht aus wie ein Platzhalter.

### Neues Design

Zweizeiliger Header mit klarer Hierarchie:

```text
Desktop:
+================================================================================+
| [Audi ::::] (klickbar, scroll-to-top)          Audi Zentrum Duesseldorf        |
|                                          ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄ |
|                                    Ihr persoenlicher Berater · Max Mustermann  |
+------- subtle shadow + border-b --────────────────────────────────────────────-+

Mobile:
+============================================+
| [Audi ::::] (klickbar)                     |
| Audi Zentrum Duesseldorf                   |
+--- shadow --──────────────────────────────-+
```

### Aenderungen

**Header-Struktur (`src/pages/Gebrauchtwagen.tsx`, Zeilen 211-239):**

1. **Audi-Logo klickbar** — `<button>` mit `onClick` → `window.scrollTo({ top: 0, behavior: 'smooth' })`, cursor-pointer
2. **Moderner Look:**
   - Hoehere Padding (`py-4` statt `py-3`)
   - Subtiler Shadow statt nur border: `shadow-sm border-b border-gray-100`
   - Logo etwas groesser (width 140)
   - Standort mit leichtem Letter-Spacing (`tracking-wide uppercase text-xs`) fuer Premium-Gefuehl
   - Verkaeufername mit einem dezenten Trennpunkt (`·`) und kleinerem "Ihr persoenlicher Berater" Label
   - Rechte Seite: Standort UEBER Beratername, beide rechtsbuendig
3. **Desktop**: Links Logo, Rechts zweizeilig (Standort oben in Caps/Tracking, Beratername darunter kleiner)
4. **Mobile**: Logo links, Standort rechts (kompakt), Berater hidden

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Header komplett umbauen: klickbares Logo mit scroll-to-top, modernes zweizeiliges Layout mit shadow, tracking, bessere Typografie |

