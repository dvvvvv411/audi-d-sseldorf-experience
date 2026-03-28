

## Footer fuer /gebrauchtwagen

Einfacher Footer mit Trennlinie, Copyright, Link-Labels (ohne Verlinkung), Hinweistext und nummerierten Fussnoten.

### Layout

```text
─────────────────────────────────────────────────
© 2026 AUDI AG. Alle Rechte vorbehalten

Impressum · Rechtliches · Hinweisgebersystem · Datenschutzinformation · Cookie-Einstellungen · Cookie-Richtlinie · Barrierefreiheit · Digital Services Act · EU Data Act

Hinweis: Die aktuelle Darstellung und Anordnung...

¹ Die Angaben zu Kraftstoffverbrauch...
² Gilt nur bei Bezahlung...
³ Nur fuer Privatkunden...
─────────────────────────────────────────────────
```

### Stil
- `bg-gray-50` passend zur CO₂-Sektion darueber (nahtloser Uebergang)
- Trennlinie oben via `border-t border-gray-200`
- Copyright: `text-xs text-gray-500 font-medium`
- Nav-Labels: `text-xs text-gray-400` mit `·` Trennern, inline
- Hinweis + Fussnoten: `text-[11px] text-gray-400 leading-relaxed`
- Padding: `py-10 px-4`, `max-w-7xl mx-auto`

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | Footer-Block nach der CO₂-Sektion einfuegen, vor `</TooltipProvider>` |

