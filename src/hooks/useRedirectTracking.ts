import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kfz_rid";
const RESOLVE_DONE_KEY = "kfz_resolve_done";

const RID_REGEX = /^kfz_[a-z0-9_]+$/i;
const RETRY_DELAYS_MS = [0, 1500, 4000, 8000];

function storeRid(rid: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, rid);
  } catch {
    // ignore
  }
}

async function tryResolveOnce(): Promise<string | null> {
  try {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : null;
    const { data, error } = await supabase.functions.invoke("kfz-resolve", {
      body: { userAgent: ua },
    });
    if (error) {
      console.error("kfz-resolve error:", error);
      return null;
    }
    const rid = (data as { redirectId?: string | null })?.redirectId;
    if (rid && RID_REGEX.test(rid)) return rid;
    return null;
  } catch (err) {
    console.error("kfz-resolve invoke error:", err);
    return null;
  }
}

async function resolveWithRetries(): Promise<string | null> {
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    const rid = await tryResolveOnce();
    if (rid) return rid;
  }
  return null;
}

/**
 * Ermittelt die redirectId ausschließlich über kfz-resolve (server-seitiger
 * IP/User-Agent-Match auf den von kfz-notify angelegten Eintrag).
 * kfz-resolve setzt captcha_solved=true und feuert den Cloaker-Webhook bereits selbst.
 */
export function useRedirectTracking() {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Bereits in dieser Session gespeichert?
      try {
        const existing = sessionStorage.getItem(STORAGE_KEY);
        if (existing && RID_REGEX.test(existing)) return;
      } catch {
        // ignore
      }

      // Bereits einmal in dieser Session aufgelöst (auch wenn negativ)?
      try {
        if (sessionStorage.getItem(RESOLVE_DONE_KEY) === "1") return;
      } catch {
        // ignore
      }

      const resolved = await resolveWithRetries();
      if (cancelled) return;

      if (resolved) {
        storeRid(resolved);
      }

      try {
        sessionStorage.setItem(RESOLVE_DONE_KEY, "1");
      } catch {
        // ignore
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);
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
