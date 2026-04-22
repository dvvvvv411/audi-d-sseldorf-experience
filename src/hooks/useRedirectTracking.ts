import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "kfz_rid";

/**
 * Liest ?rid=... aus der URL beim Mount und speichert die ID in sessionStorage.
 * So kann ein späterer Anfrage-Submit die redirectId mitgeben.
 */
export function useRedirectTracking() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const rid = searchParams.get("rid");
    if (rid && /^kfz_[a-z0-9_]+$/i.test(rid)) {
      try {
        sessionStorage.setItem(STORAGE_KEY, rid);
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
