## Meta Pixel Lead-Tracking beim "Schreiben Sie uns"-Formular

Beim erfolgreichen Absenden des Anfrage-Formulars im "Schreiben Sie uns"-Popup wird ein `fbq('track', 'Lead')`-Event an Meta Pixel gefeuert.

### Wo

- `src/pages/Gebrauchtwagen.tsx` → `handleAnfrageSubmit` (nach erfolgreichem Insert in `anfragen`, vor/nach Toast)
- `src/pages/Fahrzeugbestand.tsx` → falls dort ebenfalls ein Anfrage-Popup existiert, gleicher Aufruf an der Submit-Erfolgsstelle (kurz prüfen und ggf. ergänzen)

### Wie

Nach erfolgreichem DB-Insert:

```ts
if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
  (window as any).fbq("track", "Lead");
}
```

- Nur bei Erfolg (kein Lead bei Fehler).
- Safe-Guard: wird nichts ausgeführt, wenn auf der Domain kein Meta Pixel aktiv ist (`fbq` nicht vorhanden) – das aktive Pixel wird weiterhin über `useMetaPixel` aus dem Branding geladen.
- Kein zusätzliches `<script>`-Tag nötig, da das Pixel bereits global via Branding injiziert wird.

### Keine Änderungen

- Kein neuer Pixel-Code/keine Pixel-ID hartkodiert.
- Keine Backend-/Datenbank-Änderungen.
