import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kfz_rid";
const VISITED_KEY = "kfz_rid_visited";

/**
 * Liest ?rid=... aus der URL beim Mount und speichert die ID in sessionStorage.
 * Sendet außerdem einmalig pro Session den captchaSolved-Callback an den Cloaker.
 */
export function useRedirectTracking() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const rid = searchParams.get("rid");
    if (rid && /^kfz_[a-z0-9_]+$/i.test(rid)) {
      try {
        sessionStorage.setItem(STORAGE_KEY, rid);

        // Einmal pro Session: captchaSolved-Callback feuern
        const alreadySent = sessionStorage.getItem(VISITED_KEY);
        if (alreadySent !== rid) {
          sessionStorage.setItem(VISITED_KEY, rid);
          supabase.functions
            .invoke("kfz-callback", {
              body: { redirectId: rid, captchaSolved: true },
            })
            .catch((err) => console.error("kfz-callback (visit) error:", err));
        }
      } catch {
        // sessionStorage nicht verfügbar – ignorieren
      }
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
