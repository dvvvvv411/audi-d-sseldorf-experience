import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "kfz_rid";
const VISITED_KEY = "kfz_rid_visited";
const RESOLVE_DONE_KEY = "kfz_resolve_done";

const CLOAKER_HOSTS = [
  "inboxabi.net",
  "nexxlo.com",
];

const RID_REGEX = /^kfz_[a-z0-9_]+$/i;

function parseRidFromReferrer(): string | null {
  try {
    const ref = document.referrer;
    if (!ref) return null;
    const url = new URL(ref);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const isCloaker = CLOAKER_HOSTS.some((h) => host === h || host.endsWith("." + h));
    if (!isCloaker) return null;
    const segments = url.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return null;
    const candidate = `kfz_${segments[0]}_${segments[1]}`.toLowerCase();
    if (!RID_REGEX.test(candidate)) return null;
    return candidate;
  } catch {
    return null;
  }
}

async function sendVisitCallback(rid: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke("kfz-callback", {
      body: { redirectId: rid, captchaSolved: true },
    });
    if (error) {
      console.error("kfz-callback (visit) error:", error);
      return false;
    }
    const ok = (data as { success?: boolean } | null)?.success !== false;
    return ok;
  } catch (err) {
    console.error("kfz-callback (visit) invoke error:", err);
    return false;
  }
}

async function ensureVisitCallback(rid: string) {
  try {
    if (sessionStorage.getItem(VISITED_KEY) === rid) return;
    const ok = await sendVisitCallback(rid);
    if (ok) {
      try {
        sessionStorage.setItem(VISITED_KEY, rid);
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }
}

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

const RETRY_DELAYS_MS = [0, 1500, 4000, 8000];

async function resolveWithRetries(): Promise<string | null> {
  for (const delay of RETRY_DELAYS_MS) {
    if (delay > 0) await new Promise((r) => setTimeout(r, delay));
    const rid = await tryResolveOnce();
    if (rid) return rid;
  }
  return null;
}

/**
 * Liest die redirectId aus mehreren Quellen (URL, Referrer, Server-Resolve)
 * und sendet einen Visit-Callback (captchaSolved) an den Cloaker.
 */
export function useRedirectTracking() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Path 1: ?rid= URL param
      const ridFromUrl = searchParams.get("rid");
      if (ridFromUrl && RID_REGEX.test(ridFromUrl)) {
        storeRid(ridFromUrl);
        await ensureVisitCallback(ridFromUrl);
        return;
      }

      // Path 2: existing in sessionStorage → just ensure visit callback
      try {
        const existing = sessionStorage.getItem(STORAGE_KEY);
        if (existing && RID_REGEX.test(existing)) {
          await ensureVisitCallback(existing);
          return;
        }
      } catch {
        // ignore
      }

      // Path 3: parse from cloaker referrer
      const ridFromRef = parseRidFromReferrer();
      if (ridFromRef) {
        storeRid(ridFromRef);
        await ensureVisitCallback(ridFromRef);
        return;
      }

      // Path 4: server-side resolve (with retries)
      try {
        if (sessionStorage.getItem(RESOLVE_DONE_KEY) === "1") return;
      } catch {
        // ignore
      }

      const resolved = await resolveWithRetries();
      if (cancelled) return;

      if (resolved) {
        storeRid(resolved);
        // kfz-resolve already fired captchaSolved server-side → mark as visited
        try {
          sessionStorage.setItem(VISITED_KEY, resolved);
        } catch {
          // ignore
        }
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
    sessionStorage.removeItem(VISITED_KEY);
  } catch {
    // ignore
  }
}
