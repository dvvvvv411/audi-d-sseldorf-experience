## Bug
`EmailSendDialog` ruft `detect-gender` mit `{ vorname: ... }` auf, die Edge Function erwartet aber `{ firstName: ... }` → 400 "firstName required".

## Fix in `src/components/EmailSendDialog.tsx`
1. Payload-Key auf `firstName` umstellen.
2. Helper `extractFirstName()` einführen, der voll eingegebene Namen sauber zerlegt:
   - Trimmen, an Whitespace splitten
   - Titel ignorieren (`Dr.`, `Prof.`, `Herr`, `Frau`, `Mr.`, `Mrs.`, `Ms.`)
   - Erstes verbleibendes Token = Vorname
   - Fallback: kompletter String

```ts
const extractFirstName = (full: string) => {
  const skip = new Set(["dr.","dr","prof.","prof","herr","frau","mr.","mr","mrs.","mrs","ms."]);
  const tokens = (full ?? "").trim().split(/\s+/).filter(t => !skip.has(t.toLowerCase()));
  return tokens[0] || (full ?? "").trim();
};

// im invoke:
body: { firstName: extractFirstName(anfrage.vorname) }
```

Keine Änderungen an der Edge Function nötig.