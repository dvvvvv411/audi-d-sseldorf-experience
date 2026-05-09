## Servicenachweis: JPG/PNG zusätzlich zu PDF erlauben

In `src/pages/AdminFahrzeugDetail.tsx` wird der Servicenachweis-Bereich so erweitert, dass auch Bilder (JPG, JPEG, PNG, WEBP) hochgeladen, angezeigt und vorgeschaut werden können.

### Änderungen

**1. Upload-Validierung (`handlePdfUpload`)**
- Statt nur `application/pdf` werden auch `image/jpeg`, `image/jpg`, `image/png`, `image/webp` akzeptiert.
- Fehlertext angepasst: "ist kein gültiges Format (PDF, JPG, PNG)".
- Toast-Erfolgsmeldung von "PDF hochgeladen" auf "Datei hochgeladen" geändert.

**2. File-Input**
- `accept="application/pdf,image/jpeg,image/png,image/webp"`.
- Button-Label von "PDF hochladen" auf "Datei hochladen".

**3. Anzeige der Servicenachweise**
- Helper `isImage(url)` anhand der Datei-Endung (`.jpg`, `.jpeg`, `.png`, `.webp`).
- Bei Bildern: kleines Thumbnail (10x10) anstelle des roten PDF-Icons. Icon-Farbschema bleibt für PDFs unverändert.

**4. Viewer-Dialog**
- Bei Bildern wird `<img>` (objekt-fit contain, dunkler Hintergrund) statt `<iframe>` gerendert.
- State `pdfViewer` wird beibehalten (kein Rename nötig), Dialog-Titel angepasst auf "Servicenachweis".

**5. Entfernen**
- `removePdf` bleibt funktional gleich, Toast-Text auf "Datei entfernt".

Keine Änderungen am Storage-Bucket nötig — `fahrzeuge` ist bereits public und akzeptiert beliebige MIME-Typen.

### Geänderte Datei
- `src/pages/AdminFahrzeugDetail.tsx`
