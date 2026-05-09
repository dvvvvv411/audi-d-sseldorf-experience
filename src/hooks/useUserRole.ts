import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "caller" | null;

const STORAGE_KEY = "audi.userRole";

const readCached = (): AppRole => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "admin" || v === "caller") return v;
  } catch { /* noop */ }
  return null;
};

export const useUserRole = (): AppRole => {
  const [role, setRole] = useState<AppRole>(() => readCached());

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setRole(null);
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      const next = (data?.role as AppRole) ?? null;
      if (active) setRole(next);
      try {
        if (next) localStorage.setItem(STORAGE_KEY, next);
        else localStorage.removeItem(STORAGE_KEY);
      } catch { /* noop */ }
    };

    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setRole(null);
        try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
      } else {
        refresh();
      }
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return role;
};

export const cacheUserRole = (role: AppRole) => {
  try {
    if (role) localStorage.setItem(STORAGE_KEY, role);
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* noop */ }
};
