

## Dynamische Verkaeufer-Fahrzeugseiten

### Konzept
Die bestehende `Gebrauchtwagen.tsx` wird zum wiederverwendbaren Template. Statt das erste Fahrzeug zu laden, liest sie Verkaeufer-Slug und Auftragsnummer aus der URL und laedt die passenden Daten.

### Aenderungen

**1. `src/pages/Gebrauchtwagen.tsx` — Datenladung parametrisieren**
- `useParams` fuer `sellerSlug` und `auftragsnummer` einbinden
- Wenn Parameter vorhanden: Verkaeufer anhand Slug suchen (`vorname_nachname` lowercase), dann Fahrzeug ueber `verkaeufer_fahrzeuge` + `auftragsnummer` laden, Branding aus dem Verkaeufer ableiten
- Wenn keine Parameter: bisheriges Verhalten (erstes Fahrzeug laden) als Fallback beibehalten
- Slug-Format: `vorname_nachname` (z.B. `markus_heber`)

**2. `src/App.tsx` — Neue Route hinzufuegen**
- Route `/gebrauchtwagen/:sellerSlug/:auftragsnummer` hinzufuegen, zeigt auf dieselbe `Gebrauchtwagen`-Komponente
- Bestehende `/gebrauchtwagen` Route bleibt als Fallback

### Technische Details

Die Datenlade-Logik wird so angepasst:
```
1. sellerSlug aufsplitten → vorname + nachname
2. SELECT * FROM verkaeufer WHERE lower(vorname)=X AND lower(nachname)=Y
3. SELECT fahrzeug_id FROM verkaeufer_fahrzeuge WHERE verkaeufer_id = seller.id
4. SELECT * FROM fahrzeuge WHERE id IN (...) AND auftragsnummer = param
5. Branding aus seller.branding_id laden
```

Da alles in einer Komponente bleibt, gelten Aenderungen am Template automatisch fuer alle Verkaeufer-Seiten.

### Dateien

| Datei | Aenderung |
|---|---|
| `src/App.tsx` | Route `/gebrauchtwagen/:sellerSlug/:auftragsnummer` hinzufuegen |
| `src/pages/Gebrauchtwagen.tsx` | `useParams` nutzen, Datenladung anhand URL-Parameter anpassen |

