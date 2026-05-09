## Plan

1. **Rolle wieder korrigieren**
   - `caller@caller.de` in `user_roles` wieder auf `admin` setzen.
   - Kein separates `caller`-Rollenverhalten mehr als Grundlage für diese Einschränkung nutzen.

2. **Account-spezifische Einschränkung einführen**
   - `useUserRole` so erweitern, dass zusätzlich zur Rolle auch die eingeloggte E-Mail geladen wird.
   - Eine klare Hilfslogik verwenden: eingeschränkt ist nur `caller@caller.de`, unabhängig davon, dass seine Rolle `admin` ist.
   - Während Rolle/E-Mail laden, weiterhin den neutralen Audi-Ladescreen anzeigen, damit nichts kurz sichtbar wird.

3. **Sidebar/Route-Zugriff nur für diesen Account beschränken**
   - `AdminLayout` nicht mehr mit `role !== "admin"` einschränken.
   - Stattdessen nur bei `email === "caller@caller.de"` folgende Reiter ausblenden/umleiten:
     - Verkäufer
     - Brandings
     - Email Templates
     - Exposés
     - Angebote
     - Telegram
     - Inzahlungnahme
   - Erlaubt bleiben für `caller@caller.de`: Dashboard, Fahrzeugbestand, Anfragen, SMS Verlauf, Email Verlauf.

4. **Buttons in Anfragen verstecken**
   - In `AdminAnfragen` die Buttons `Angebot erstellen` und `Exposé erstellen` nicht mehr an `role === "admin"` hängen.
   - Stattdessen nur für `caller@caller.de` ausblenden.
   - Zusätzlich dieselben Buttons in `AdminAnfrageDetail` ausblenden, weil sie dort ebenfalls existieren.

5. **Validierung**
   - Datenbank prüfen, dass `caller@caller.de` wieder `admin` ist.
   - Code-Suche prüfen, dass keine `caller`-Rollenlogik mehr die Admin-Rechte allgemein kappt.
   - Sicherstellen, dass eingeschränkte Pfade direkt aufgerufen sofort nach `/admin` redirecten und vorher keine gesperrte UI rendern.