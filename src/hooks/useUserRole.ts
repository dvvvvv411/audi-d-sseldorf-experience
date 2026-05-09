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

const EMPTY: UserRoleState = {
  role: null,
  email: null,
  userId: null,
  isRestricted: false,
  loading: false,
};

export const useUserRole = (): UserRoleState => {
  const [state, setState] = useState<UserRoleState>({ ...EMPTY, loading: true });

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      if (active) setState((s) => ({ ...s, loading: true }));
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        if (active) setState({ ...EMPTY });
        return;
      }
      const email = session.user.email ?? null;
      const userId = session.user.id;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();
      const next = (data?.role as AppRole) ?? null;
      if (active) setState({
        role: next,
        email,
        userId,
        isRestricted: userId === RESTRICTED_USER_ID,
        loading: false,
      });
    };

    refresh();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        if (active) setState({ ...EMPTY });
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
