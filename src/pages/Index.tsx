import { Button } from "@/components/ui/button";
import { Phone, MapPin, ChevronDown } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const AudiRings = () => (
  <svg viewBox="0 0 200 50" className="w-36 md:w-44 h-auto opacity-90" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="73" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="106" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="139" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const Index = () => {
  usePageMeta("Audi Düsseldorf – Ihr Premium-Partner", "Willkommen bei Audi Düsseldorf. Entdecken Sie Neuwagen, Gebrauchtwagen, Service und Beratung bei Ihrem Audi Partner in Düsseldorf.");
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/40" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 text-foreground">
          <AudiRings />
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-foreground mb-4">
          Audi <span className="font-semibold">Düsseldorf</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl tracking-widest uppercase mb-12 font-light">
          Ihr Premium-Partner für Audi Fahrzeuge
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="px-10 py-6 text-base tracking-wide uppercase font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
          >
            Fahrzeuge entdecken
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-10 py-6 text-base tracking-wide uppercase font-medium border-foreground/30 text-foreground hover:bg-foreground/10 transition-all"
          >
            Termin vereinbaren
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-24 md:bottom-20 animate-bounce text-muted-foreground">
          <ChevronDown className="w-6 h-6" />
        </div>
      </main>

      {/* Bottom contact bar */}
      <footer className="relative z-10 border-t border-border/50 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>Königsallee 12, 40212 Düsseldorf</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>+49 211 123 456 0</span>
          </div>
          <span className="hidden md:inline text-muted-foreground/60">Mo–Fr 8:00–19:00 · Sa 9:00–16:00</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
