import { useEffect } from "react";
import { useActiveBranding } from "@/hooks/useActiveBranding";

const Index = () => {
  const { branding, loading } = useActiveBranding();

  useEffect(() => {
    if (loading) return;
    const target = branding?.originallink?.trim();
    if (target) {
      window.location.replace(target);
    }
  }, [branding, loading]);

  return null;
};

export default Index;
