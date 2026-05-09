import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "caller" | null;

export interface UserRoleState {
  role: AppRole;
  loading: boolean;
}

export const useUserRole = (): UserRoleState => {
  const [state, setState] = useState<UserRoleState>({ role: null, loading: true });

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      if (active) setState((s) => ({ role: s.role, loading: true }));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setState({ role: null, loading: false });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      const next = (data?.role as AppRole) ?? null;
      if (active) setState({ role: next, loading: false });
    };

    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        if (active) setState({ role: null, loading: false });
      } else {
        refresh();
      }
    });

    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return state;
};

// Beibehalten für Auth.tsx Kompatibilität (no-op-fähig)
export const cacheUserRole = (_role: AppRole) => {
  // bewusst leer – wir lesen DB-first im Hook
};
