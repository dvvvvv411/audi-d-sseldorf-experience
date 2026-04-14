

## Angebote: PLZ/Stadt optional + Unternehmensname

### Aenderungen in `src/pages/AdminAngebote.tsx`

**1. PLZ + Stadt optional machen**
- Label aendern zu "PLZ + Stadt (optional)"
- `canGenerate` Bedingung: `interessentPlzStadt.trim()` entfernen -- nur noch Name ist Pflicht
- PDF-Generierung: PLZ/Stadt-Zeile nur rendern wenn `interessent.plzStadt.trim()` nicht leer (gleiche Logik wie bei Strasse)

**2. Neues Feld "Unternehmensname"**
- Neuer State: `const [interessentFirma, setInteressentFirma] = useState("")`
- Neues Input-Feld im Formular (zwischen Name und Strasse), Label: "Unternehmensname (optional)"
- `interessent`-Objekt erhaelt neues Feld `firma: string`
- PDF-Generierung Seite 1: Nach `für {name}` wird, wenn `firma.trim()` nicht leer, eine Zeile mit dem Firmennamen eingefuegt
- PDF Seite 2: Im `Angebot Nr. ... an {name}` Header bleibt nur der Name

**3. URL-Param Unterstuetzung**
- Neuer optionaler URL-Param `firma` zum Vorausfuellen

### Dateien

| Datei | Aenderung |
|---|---|
| `src/pages/AdminAngebote.tsx` | PLZ/Stadt optional, neues Firma-Feld + PDF-Logik |

