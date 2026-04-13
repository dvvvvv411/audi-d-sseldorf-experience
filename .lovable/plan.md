

## Fixes: Audi Logo Verzerrung + Hardcoded "Audi AG"

### Problem 1: Logo verzerrt
Das SVG hat `width="62" height="22"` (Seitenverhältnis ~2.82:1), aber der Code verwendet `logoH * 4` (4:1 Ratio). Zudem ist `img.width * 2` bei einem 62px-SVG nur 124px Canvas -- zu niedrig aufgelöst.

### Problem 2: Header zeigt `branding.name` statt "Audi AG"

### Änderungen in `src/pages/AdminExposes.tsx`

**Logo-Fix (Zeilen 50-70, 174-177):**
- Canvas-Auflösung erhöhen: `canvas.width = 800`, `canvas.height = Math.round(800 * (99/284))` (= ~279px) -- basierend auf viewBox 284x99
- Logo-Aspect-Ratio korrigieren: `logoW = logoH * (284/99)` statt `logoH * 4`

**Header-Fix (Zeile 155):**
- `branding.name` → `"Audi AG"` (hardcoded)

