

## Betreffzeilen für beide Email-Templates

### Änderungen in `src/pages/AdminEmailTemplates.tsx`

**1. Anfrage-Bestätigung -- Betreff**
- Read-only Feld: `Ihre Anfrage – [Fahrzeugname]`
- Copy-Button daneben

**2. Marketing-Email -- Betreff**
- Editierbares Input mit Standardwert: `Ausgewählte Fahrzeugangebote – [Branding Name]`
- Copy-Button daneben

**3. State + UI**
- Neue States: `anfrageBetreff`, `marketingBetreff`
- Betreff-Block zwischen Selects und iframe-Vorschau

| Datei | Änderung |
|---|---|
| `src/pages/AdminEmailTemplates.tsx` | Betreff-States, UI-Felder mit Copy-Buttons für beide Sektionen |

