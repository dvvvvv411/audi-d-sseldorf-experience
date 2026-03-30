

## Routen-Schutz: /gebrauchtwagen und /fahrzeugbestand nur für Admins

### Logik

- `/gebrauchtwagen` (ohne Parameter) und `/fahrzeugbestand` (ohne Parameter) sollen nur für eingeloggte Admins erreichbar sein
- `/gebrauchtwagen/:sellerSlug/:auftragsnummer` und `/fahrzeugbestand/:sellerSlug` bleiben öffentlich (für Anon-User)

### Änderung in `src/App.tsx`

Die beiden Basis-Routen mit `ProtectedRoute` wrappen:

```tsx
<Route path="/gebrauchtwagen" element={<ProtectedRoute><Gebrauchtwagen /></ProtectedRoute>} />
<Route path="/fahrzeugbestand" element={<ProtectedRoute><Fahrzeugbestand /></ProtectedRoute>} />
```

Die parametrisierten Routen bleiben unverändert (öffentlich):
```tsx
<Route path="/fahrzeugbestand/:sellerSlug" element={<Fahrzeugbestand />} />
<Route path="/gebrauchtwagen/:sellerSlug/:auftragsnummer" element={<Gebrauchtwagen />} />
```

| Datei | Änderung |
|---|---|
| `src/App.tsx` | `/gebrauchtwagen` und `/fahrzeugbestand` mit `ProtectedRoute` wrappen |

