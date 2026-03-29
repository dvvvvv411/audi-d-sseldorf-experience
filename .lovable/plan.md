

## Loading-Spinner durch Audi-Logo-Animation ersetzen

### Konzept
Der aktuelle Spinner (drehender Kreis) wird durch eine pulsierende Audi-Ringe-Animation ersetzt. Das bereits vorhandene `AudiLogo`-SVG wird wiederverwendet und mit einer sanften Puls-Animation versehen.

### Umsetzung in `src/pages/Fahrzeugbestand.tsx`

**Zeilen 132-137** — Loading-State ersetzen:
- Statt `animate-spin border` Kreis → `AudiLogo` Komponente mit `animate-pulse` und `opacity-40`
- Darunter optional kleiner Text "Wird geladen..." in grau
- Logo in grau (`fill="#999"`) dargestellt, pulsierend

```text
Vorher:                              Nachher:
Drehender Kreis (border)             Audi-Logo (80x28)
animate-spin                         animate-pulse, opacity-40
                                     fill="#999", sanftes Pulsieren
```

| Datei | Aenderung |
|---|---|
| `src/pages/Fahrzeugbestand.tsx` | Loading-Spinner durch pulsierende AudiLogo-Komponente ersetzen |

