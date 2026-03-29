

## Gesamte FahrzeugCard klickbar + Preis-Hover-Effekt

### Konzept
Die gesamte Karte wird zu einem klickbaren Link. Beim Hover über **irgendeine Stelle** der Karte wechselt das Preis-Element von grau (`#323232`) zu blau (`#00527a`).

### Änderung in `src/pages/Fahrzeugbestand.tsx`

**FahrzeugCard-Komponente (Zeilen 45-94):**

1. Den äußeren `<div>` durch einen `<Link>` ersetzen, der auf die Produktseite verlinkt
2. Den bestehenden `<Link>` am Preis-Footer durch ein normales `<div>` ersetzen (da die ganze Karte bereits ein Link ist)
3. CSS `group`-Klasse auf den äußeren Link setzen, damit der Preis-Footer via `group-hover:bg-[#00527a]` bei Hover über die gesamte Karte blau wird

```text
Vorher:                              Nachher:
<div> (nicht klickbar)               <Link className="group"> (gesamte Karte klickbar)
  ...                                  ...
  <Link> (nur Preis klickbar)          <div className="group-hover:bg-[#00527a]">
    Preis-Footer                         Preis-Footer
  </Link>                             </div>
</div>                               </Link>
```

| Datei | Änderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Äußeren Container → `Link` mit `group`, Preis-Footer → `div` mit `group-hover` |

