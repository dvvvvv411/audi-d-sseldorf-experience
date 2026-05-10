import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Branding = Tables<"brandings"> & {
  footer_unternehmensname?: string | null;
  vorstand?: unknown;
  originallink?: string | null;
  eigene_domain?: string | null;
};

/**
 * Loads the "active" branding for the current page:
 * - First tries to match by current hostname against `eigene_domain`
 * - Falls back to the first branding in the table
 */
export function useActiveBranding() {
  const [branding, setBranding] = useState<Branding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const host = typeof window !== "undefined" ? window.location.hostname : "";
      const { data: all } = await supabase.from("brandings").select("*");
      if (!alive) return;
      const list = (all ?? []) as Branding[];
      const byDomain = list.find(
        (b) => b.eigene_domain && host && (host === b.eigene_domain || host.endsWith("." + b.eigene_domain))
      );
      setBranding(byDomain ?? list[0] ?? null);
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { branding, loading };
}

export const getBrandShort = (b: { name?: string | null } | null | undefined): string => {
  if (!b?.name) return "";
  return b.name.split(/\s+/)[0] || "";
};

export const getVorstandList = (b: Branding | null): string[] => {
  const v = b?.vorstand;
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
  return [];
};
