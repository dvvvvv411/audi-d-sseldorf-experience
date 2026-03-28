import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const AudiRings = () => (
  <svg viewBox="0 0 200 50" className="w-36 md:w-44 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="73" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="106" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="139" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register state
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/admin");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      toast.error("Passwörter stimmen nicht überein");
      return;
    }
    if (regPassword.length < 6) {
      toast.error("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side — dark branding */}
      <div className="lg:w-1/2 bg-[hsl(0,0%,5%)] text-white flex flex-col items-center justify-center p-10 lg:p-16 relative overflow-hidden min-h-[280px] lg:min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(0,0%,5%)] via-[hsl(0,0%,8%)] to-[hsl(0,0%,12%)]" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/[0.03] to-transparent" />

        <div className="relative z-10 flex flex-col items-center text-center gap-6">
          <AudiRings />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
            Audi <span className="font-semibold">Düsseldorf</span>
          </h1>
          <p className="text-white/50 text-sm md:text-base tracking-[0.25em] uppercase font-light">
            Verwaltungsportal
          </p>
          <div className="mt-4 w-16 h-px bg-white/20" />
          <p className="text-white/30 text-xs max-w-xs leading-relaxed hidden lg:block">
            Verwalten Sie Ihren Fahrzeugbestand, bearbeiten Sie Kundenanfragen und behalten Sie den Überblick.
          </p>
        </div>
      </div>

      {/* Right side — light auth form */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-500"
              >
                Anmelden
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-white data-[state=active]:text-black text-gray-500"
              >
                Registrieren
              </TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Willkommen zurück</h2>
                <p className="text-gray-500 text-sm mt-1">Melden Sie sich in Ihrem Konto an</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-700 text-sm font-medium">
                    E-Mail
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-700 text-sm font-medium">
                    Passwort
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 pr-12 focus-visible:ring-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 text-sm tracking-wide uppercase font-medium"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Anmelden"}
                </Button>
              </form>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Konto erstellen</h2>
                <p className="text-gray-500 text-sm mt-1">Registrieren Sie sich als Administrator</p>
              </div>
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-gray-700 text-sm font-medium">
                    E-Mail
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-gray-700 text-sm font-medium">
                    Passwort
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Mindestens 6 Zeichen"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 pr-12 focus-visible:ring-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm" className="text-gray-700 text-sm font-medium">
                    Passwort bestätigen
                  </Label>
                  <div className="relative">
                    <Input
                      id="reg-confirm"
                      type={showConfirm ? "text" : "password"}
                      required
                      placeholder="Passwort wiederholen"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      className="h-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 pr-12 focus-visible:ring-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-gray-900 text-white hover:bg-gray-800 text-sm tracking-wide uppercase font-medium"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Registrieren"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
