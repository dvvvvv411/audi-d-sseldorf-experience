import { useEffect, useState } from "react";
import { useActiveBranding } from "@/hooks/useActiveBranding";

const Index = () => {
  const { branding, loading } = useActiveBranding();
  const [blocked, setBlocked] = useState(false);

  const target = branding?.originallink?.trim() || "";

  useEffect(() => {
    if (loading || !target) return;
    // Falls die Zielseite das Framing per X-Frame-Options/CSP verbietet,
    // erkennen wir das nicht zuverlässig per JS. Als Fallback nach 4s
    // auf Redirect umschalten, wenn der Iframe leer/blockiert geblieben ist.
    const t = window.setTimeout(() => {
      if (!document.hidden && blocked) {
        window.location.replace(target);
      }
    }, 4000);
    return () => window.clearTimeout(t);
  }, [loading, target, blocked]);

  if (loading || !target) return null;

  return (
    <iframe
      src={target}
      title="Original"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
      onError={() => setBlocked(true)}
    />
  );
};

export default Index;
