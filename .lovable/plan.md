

## Badge mit Anzahl neuer Anfragen in der Sidebar

### Änderung in `src/pages/AdminLayout.tsx`

1. **useEffect beim Mount**: Anzahl der Anfragen mit `status = 'NEU'` aus Supabase laden (`supabase.from("anfragen").select("id", { count: "exact", head: true }).eq("status", "NEU")`)
2. **State**: `neuCount: number` speichert die Anzahl
3. **Badge**: Beim "Anfragen"-Nav-Item rechts einen roten Kreis mit der Zahl anzeigen (nur wenn > 0), z.B. `<span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{neuCount}</span>`

| Datei | Änderung |
|---|---|
| `src/pages/AdminLayout.tsx` | `useEffect` + State für NEU-Count, roter Badge neben "Anfragen" |

