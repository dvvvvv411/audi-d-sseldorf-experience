

## Footer: AUDI AG mit "Audi Vertriebssystem" Hinweis

### Änderung in `src/pages/AdminEmailTemplates.tsx`

Footer-Sektion (ca. Zeile 107-116) ersetzen:

- **Hinweis-Zeile** (zentriert, grau): `Audi Vertriebssystem — Ein Service der AUDI AG`
- **Darunter feste AUDI AG Daten:**
  - AUDI AG
  - Auto-Union-Straße 1, 85057 Ingolstadt
  - www.audi.de
  - AG Ingolstadt · HRB 1
  - Vorstand: Gernot Döllner (Vorsitzender)
  - USt-IdNr.: DE 811 115 368

Keine dynamischen `${branding.*}` Felder mehr im Footer.

| Datei | Änderung |
|---|---|
| `src/pages/AdminEmailTemplates.tsx` | Footer: feste AUDI AG Daten + "Audi Vertriebssystem" |

