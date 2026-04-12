

## Fixes for Exposé PDF

### 4 Issues to Fix in `src/pages/AdminExposes.tsx`

**1. Audi Logo not loading**
- jsPDF doesn't support SVG format via `addImage` with "SVG" type reliably
- Fix: Draw the four Audi rings manually using jsPDF circle drawing (`doc.circle()`) instead of embedding an SVG image
- Draw 4 overlapping circles with stroke, no fill -- simple and reliable

**2. Distorted 2x2 images**
- Currently images are stretched to fill fixed dimensions regardless of aspect ratio
- Fix: Load each image into an `Image()` element first to get its natural width/height, then calculate the correct crop dimensions to fill the target area without distortion (center-crop / object-fit:cover logic)

**3. Serien- und Sonderausstattung section too small**
- Currently capped at 12 lines with tiny 7pt font and 3mm line height
- Fix: Increase max lines to ~20, use 8pt font, 3.5mm line height to fill available space

**4. Footer / Barpreis positioning wrong**
- Currently the footer position is dynamic (depends on description length), which causes it to float in the middle of the page
- Fix: Pin the footer to a fixed Y position near the bottom of the page (e.g. y=260mm), and let the description section fill the space between the data table and the footer. This ensures consistent layout regardless of content length.

### Technical Details

| Change | Detail |
|---|---|
| Audi Logo | Replace `addImage(SVG)` with 4x `doc.circle()` calls, overlapping rings |
| Image aspect ratio | Helper function: load `Image()`, compute crop rect, draw via canvas to get properly cropped base64 |
| Description section | Increase to 8pt, 3.5mm line-height, dynamically fill space up to footer |
| Footer position | Fixed at Y=258mm from top, description fills remaining space between data and footer |

### Files

| File | Change |
|---|---|
| `src/pages/AdminExposes.tsx` | All 4 fixes in the `generateExposePdf` function |

