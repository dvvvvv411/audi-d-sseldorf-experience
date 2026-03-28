

## Header umgestalten — Logo + Trennstrich + Branding links, Berater rechts zweizeilig

### Neues Layout

```text
Desktop:
+--[Audi ::::] | Audi Zentrum Duesseldorf ———————— Ihr persoenlicher Berater --+
|                                                          +49 123 456789      |
+--- shadow-sm border-b ——————————————————————————————————————————————————————-+

Mobile:
+--[Audi ::::] | Audi Zentrum Duesseldorf ————————————————————————————————————-+
+--- shadow-sm border-b ——————————————————————————————————————————————————————-+
```

### Aenderungen in `src/pages/Gebrauchtwagen.tsx` (Zeilen 213-241)

**Links:** Audi-Logo + vertikaler Strich (`border-l border-gray-300 h-8 mx-3`) + Branding-Name — alles in einer `flex items-center` Gruppe

**Rechts:** Zweizeilig, rechtsbuendig:
- Zeile 1: "Ihr persoenlicher Berater · Max Mustermann"
- Zeile 2: Telefonnummer (aus `verkaeufer[0].telefon`)
- Auf Mobile hidden

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Header-Layout umbauen: Logo + Divider + Branding links, Berater + Telefon rechts zweizeilig |

