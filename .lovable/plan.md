

## Tooltips für Aktions-Buttons in /admin/anfragen

Alle drei Icon-Buttons (Notizen, Mailbox, Detail) bekommen einen Tooltip beim Hover.

### Änderung in `src/pages/AdminAnfragen.tsx`

- `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` aus `@/components/ui/tooltip` importieren
- Die drei Buttons in der Aktions-Spalte jeweils mit `<Tooltip><TooltipTrigger asChild>...</TooltipTrigger><TooltipContent>Label</TooltipContent></Tooltip>` wrappen
- Labels: "Notizen", "Mailbox", "Details"
- `TooltipProvider` um den gesamten Return-Block

| Datei | Änderung |
|---|---|
| `src/pages/AdminAnfragen.tsx` | Tooltip-Wrapper um alle 3 Aktions-Buttons |

