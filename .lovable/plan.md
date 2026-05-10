## Plan: Branding-Wizard als eigene Seite

Statt Dialog wird das Hinzufügen/Bearbeiten eines Brandings auf einer eigenen Route mit Multi-Step Wizard umgesetzt.

### Neue Routen (in `src/App.tsx`)
- `/admin/brandings/neu` → Wizard im Create-Modus
- `/admin/brandings/:id/bearbeiten` → Wizard im Edit-Modus (lädt Daten via id)

Beide unter `AdminLayout` und durch `ProtectedRoute` geschützt.

### Neue Datei: `src/pages/AdminBrandingWizard.tsx`
Eine Komponente, die per `useParams` zwischen Create und Edit unterscheidet. Übernimmt Formular-State, Validierung pro Step, Upload-Logik und finalen Save aus dem bisherigen Dialog.

#### Steps (5)
1. **Stammdaten** — Unternehmensname, Straße, PLZ, Stadt, E-Mail (alle Pflicht)
2. **Rechtliches** — Amtsgericht, Handelsregister, Geschäftsführer, USt-IdNr., Footer-Unternehmensname, Vorstandsmitglieder
3. **Logos & Bilder** — Logo (PDF/Bestand), Marketing-Bild, externes E-Mail-Logo
4. **Domains & Integrationen** — Originallink, eigene Domain, Resend (API-Key, Absender, Absendername), Seven.io (Absendername, API-Key)
5. **Meta Pixel & Abschluss** — Pixel-Toggle + Code, Zusammenfassung der wichtigsten Felder, „Speichern"-Button

#### UI-Verhalten
- Header mit Titel („Branding hinzufügen" / „Branding bearbeiten") und „Zurück zur Übersicht"-Link.
- Step-Indikator oben (nummerierte Kreise mit Verbindungslinien, aktueller/abgeschlossener/offener Status).
- Footer mit „Zurück" / „Weiter" bzw. „Speichern" auf letztem Step.
- Pflichtfeld-Validierung pro Step vor „Weiter"; Sprung zu beliebigem bereits besuchtem Step durch Klick auf Indikator erlaubt.
- Im Edit-Modus: bei Mount Branding via `supabase.from('brandings').select().eq('id', id).single()` laden; Loader-State.
- Nach erfolgreichem Save: Toast + Navigate zurück nach `/admin/brandings`.

### Anpassung: `src/pages/AdminBrandings.tsx`
- Dialog inkl. komplettem Formular-Markup, `dialogOpen`, `form`, `editId`, `uploading`, `handleSave`, `uploadFile`, `set` etc. **entfernen**.
- `openCreate` → `navigate('/admin/brandings/neu')`.
- `openEdit(b)` → `navigate(\`/admin/brandings/${b.id}/bearbeiten\`)`.
- Liste, Lade-State und Delete bleiben unverändert.

### Technische Details
- Wiederverwendung des `branding-assets` Storage-Buckets und der bestehenden Upload-Funktion (1:1 in den Wizard übernommen).
- Step-State: `const [step, setStep] = useState(0)` plus `visitedSteps: Set<number>` für klickbare Indikator-Schritte.
- Validierung: kleine `validateStep(n): string | null` Funktion, die bei Fehler einen Toast mit der Pflichtfeld-Meldung zeigt.
- Styling konsistent zum Admin-Theme (weiße Cards, `bg-gray-50` Inputs, schwarzer Primary-Button), keine neuen Tokens nötig.
- Keine Schema-Änderungen, keine Anpassungen an anderen Seiten oder Hooks.

### Nicht im Scope
- Auto-Save / Draft-Persistenz zwischen Steps.
- Änderungen an Datenmodell oder bestehenden Brandings.
- Refactor der Listen-Ansicht.
