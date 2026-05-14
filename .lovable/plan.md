## Ziel
Auf `/admin/fahrzeugbestand/:id` im Block "Servicenachweis(e)" sollen PDFs (und JPG/PNG/WEBP) auch per Drag-and-Drop hochgeladen werden können – zusätzlich zum bestehenden "Datei hochladen"-Button.

## Umsetzung in `src/pages/AdminFahrzeugDetail.tsx`

1. Neuer State `dragOver: boolean`.
2. Bestehende Upload-Logik in eine wiederverwendbare Funktion `uploadFiles(files: File[])` extrahieren (aktuell in `handlePdfUpload`). `handlePdfUpload` ruft sie weiter mit `e.target.files` auf.
3. Den Bereich unter der Überschrift "Servicenachweis(e)" (sowohl der Leerzustand "Keine Servicenachweise vorhanden." als auch das Grid mit den Dateien) in einen Drop-Container wickeln mit:
   - `onDragOver` (preventDefault + `setDragOver(true)`)
   - `onDragLeave` (`setDragOver(false)`)
   - `onDrop` (preventDefault, `uploadFiles(Array.from(e.dataTransfer.files))`, `setDragOver(false)`)
4. Visuelles Feedback:
   - Beim Leerzustand: gestrichelter Rahmen, Hinweistext "PDF, JPG oder PNG hier ablegen oder Button oben nutzen".
   - Beim Drüberziehen: Rahmen + Hintergrund hervorheben (`border-emerald-400 bg-emerald-50/50`).
   - Während `uploadingPdf=true`: dezenter Overlay-Hinweis "Wird hochgeladen…".
5. Bestehende Validierung (Dateitypen) und Toasts bleiben unverändert. Keine Änderungen an Datenbank, Storage-Buckets oder anderen Seiten.

Keine Backend- oder Migrationsänderungen nötig.