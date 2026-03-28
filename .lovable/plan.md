

## Zwei neue Cards in der rechten Spalte (40%)

### Aenderung in `src/pages/Gebrauchtwagen.tsx` (Zeilen 374-412)

Die rechte 40%-Spalte (`lg:sticky lg:top-4 lg:self-start`) enthaelt aktuell nur "Ihr Ansprechpartner". Darunter werden zwei weitere Cards eingefuegt:

**Card 1: "Unsere Leistungen"**
- Ueberschrift: `text-xl font-bold`
- 5 Punkte mit Check-Icons (gleicher Stil wie Beschreibung):
  - 3 Jahre Audi Gebrauchtwagengarantie
  - inklusive Kostenfreie Lieferung in Deutschland, Oesterreich und der Schweiz
  - Attraktive Konditionen auch fuer Gewerbekunden
  - Direkte Vermittlung im Kundenauftrag (ohne Zwischenhandel)
  - Persoenlicher Ansprechpartner von Auswahl bis Auslieferung

**Card 2: "Ihre Vorteile"**
- Gleicher Stil, 6 Punkte mit Check-Icons:
  - Direkter Zugang zu exklusiven Kundenfahrzeugen
  - Attraktive Preisvorteile gegenueber dem klassischen Handel
  - Individuelle Beratung abgestimmt auf Ihre Wuensche
  - Schnelle und flexible Fahrzeuguebergabe
  - Kauf ohne versteckte Zusatzkosten
  - Sicherheit durch Vermittlung gepruefter Fahrzeuge

**Sticky-Verhalten**: Die gesamte rechte Spalte bleibt sticky — alle 3 Cards (Ansprechpartner + Leistungen + Vorteile) scrollen zusammen mit. `space-y-6` zwischen den Cards.

Beide Cards nutzen `bg-gray-50 rounded-lg p-6` wie die Ansprechpartner-Card.

### Datei

| Datei | Aenderung |
|---|---|
| `src/pages/Gebrauchtwagen.tsx` | 2 neue Cards nach der Ansprechpartner-Card in der rechten Spalte (Zeile ~411) |

