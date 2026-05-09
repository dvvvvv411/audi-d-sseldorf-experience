import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "caller" | null;

export const RESTRICTED_USER_ID = "0bc8bcc6-3555-4888-80b5-8a74df8a6873";
export const RESTRICTED_EMAIL = "caller@caller.de";

export interface UserRoleState {
  role: AppRole;
  email: string | null;
  userId: string | null;
  isRestricted: boolean;
  loading: boolean;
}

export const useUserRole = (): UserRoleState => {
  const [state, setState] = useState<UserRoleState>({
    role: null,
    email: null,
    isRestricted: false,
    loading: true,
  });

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      if (active) setState((s) => ({ ...s, loading: true }));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setState({ role: null, email: null, isRestricted: false, loading: false });
        return;
      }
      const email = session.user.email ?? null;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      const next = (data?.role as AppRole) ?? null;
      if (active) setState({
        role: next,
        email,
        isRestricted: email?.toLowerCase() === RESTRICTED_EMAIL,
        loading: false,
      });
    };

    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        if (active) setState({ role: null, email: null, isRestricted: false, loading: false });
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
