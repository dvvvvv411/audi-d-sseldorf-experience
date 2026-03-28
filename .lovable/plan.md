

## Admin Panel Verbesserung

### Aenderungen

**1. Sidebar umgestalten (schwarz mit weissem Text)**
- Hintergrund: `bg-black` statt `bg-white`
- Alle Texte, Icons, Trennlinien: weiss/grau-hell
- Aktiver Nav-Item: weisser Hintergrund mit schwarzem Text (invertiert)
- Logout-Button: weiss mit rotem Hover

**2. Navigation vereinfachen**
- Entferne die drei Reiter: Fahrzeugbestand, Fahrzeug hinzufuegen, Anfragen
- Ersetze durch einen einzelnen "Dashboard"-Eintrag (aktiv by default)

**3. Dashboard-Mockup als Hauptinhalt**
- Statistik-Karten oben: Fahrzeuge gesamt, Verfuegbar, Reserviert, Neue Anfragen (mit Zahlen aus den Mockdaten)
- Darunter zwei Spalten: Links eine kleine Tabelle "Neueste Fahrzeuge" (Top 3), rechts "Aktuelle Anfragen" (Top 3)
- Alles im hellen Theme (weisser Hintergrund, graue Borders)

**4. Aufräumen**
- Tab-State und Tab-Logik entfernen
- Mock-Daten bleiben fuer die Dashboard-Anzeige

### Datei
- `src/pages/Admin.tsx` — komplettes Rewrite

