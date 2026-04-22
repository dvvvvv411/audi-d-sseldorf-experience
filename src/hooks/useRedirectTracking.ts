import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kfz_rid";
const VISITED_KEY = "kfz_rid_visited";
const RESOLVE_KEY = "kfz_resolve_attempted";

/**
 * Liest ?rid=... aus der URL beim Mount und speichert die ID in sessionStorage.
 * Sendet außerdem einmalig pro Session den captchaSolved-Callback an den Cloaker.
 *
 * Fallback: Falls kein ?rid= in URL und nichts im sessionStorage liegt,
 * wird kfz-resolve aufgerufen, um den Visitor anhand seiner IP zuzuordnen.
 */
export function useRedirectTracking() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const ridFromUrl = searchParams.get("rid");

    // Pfad 1: rid via URL-Param
    if (ridFromUrl && /^kfz_[a-z0-9_]+$/i.test(ridFromUrl)) {
      try {
        sessionStorage.setItem(STORAGE_KEY, ridFromUrl);

        const alreadySent = sessionStorage.getItem(VISITED_KEY);
        if (alreadySent !== ridFromUrl) {
          sessionStorage.setItem(VISITED_KEY, ridFromUrl);
          supabase.functions
            .invoke("kfz-callback", {
              body: { redirectId: ridFromUrl, captchaSolved: true },
            })
            .catch((err) => console.error("kfz-callback (visit) error:", err));
        }
      } catch {
        // sessionStorage nicht verfügbar – ignorieren
      }
      return;
    }

    // Pfad 2: kein rid in URL → Fallback via IP-Matching (kfz-resolve)
    try {
      const existing = sessionStorage.getItem(STORAGE_KEY);
      const attempted = sessionStorage.getItem(RESOLVE_KEY);
      if (existing || attempted) return;

      sessionStorage.setItem(RESOLVE_KEY, "1");

      supabase.functions
        .invoke("kfz-resolve", { body: {} })
        .then(({ data, error }) => {
          if (error) {
            console.error("kfz-resolve error:", error);
            return;
          }
          const rid = (data as { redirectId?: string | null })?.redirectId;
          if (rid && /^kfz_[a-z0-9_]+$/i.test(rid)) {
            try {
              sessionStorage.setItem(STORAGE_KEY, rid);
              sessionStorage.setItem(VISITED_KEY, rid);
            } catch {
              // ignore
            }
          }
        })
        .catch((err) => console.error("kfz-resolve invoke error:", err));
    } catch {
      // sessionStorage nicht verfügbar – ignorieren
    }
  }, [searchParams]);
}

export function getRedirectId(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearRedirectId() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
