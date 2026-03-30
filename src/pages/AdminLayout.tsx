import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, LogOut, Menu, Users, Building2, Car, MessageSquare, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const AudiRingsSmall = () => (
  <svg viewBox="0 0 200 50" className="w-20 h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="73" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="106" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="139" cy="25" r="20" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
];

const verwaltungNav = [
  { label: "Verkäufer", icon: Users, path: "/admin/verkaeufer" },
  { label: "Brandings", icon: Building2, path: "/admin/brandings" },
  { label: "Fahrzeugbestand", icon: Car, path: "/admin/fahrzeugbestand" },
  { label: "Anfragen", icon: MessageSquare, path: "/admin/anfragen" },
  { label: "Email Templates", icon: Mail, path: "/admin/email-templates" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [neuCount, setNeuCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("anfragen")
        .select("id", { count: "exact", head: true })
        .in("status", ["NEU", "Neu"]);
      setNeuCount(count ?? 0);
    };
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? "");
    };
    fetchCount();
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const initials = userEmail
    ? userEmail.substring(0, 2).toUpperCase()
    : "AD";

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const NavButton = ({ item }: { item: { label: string; icon: React.ElementType; path: string } }) => {
    const active = isActive(item.path);
    return (
      <button
        onClick={() => {
          navigate(item.path);
          setSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
          active
            ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
            : "text-slate-400 hover:text-white hover:bg-white/10"
        }`}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span className="truncate">{item.label}</span>
        {item.label === "Anfragen" && neuCount > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {neuCount}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50 admin-theme">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 pb-4">
          <div className="text-white">
            <AudiRingsSmall />
          </div>
          <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase mt-2 font-medium">Verwaltung</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-6 overflow-y-auto">
          {/* Main */}
          <div className="space-y-1">
            {mainNav.map((item) => (
              <NavButton key={item.path} item={item} />
            ))}
          </div>

          {/* Separator + Verwaltung Group */}
          <div>
            <div className="flex items-center gap-2 px-3 mb-2">
              <span className="text-[10px] text-slate-500 tracking-[0.15em] uppercase font-semibold">Verwaltung</span>
              <div className="flex-1 h-px bg-slate-700/50" />
            </div>
            <div className="space-y-1">
              {verwaltungNav.map((item) => (
                <NavButton key={item.path} item={item} />
              ))}
            </div>
          </div>
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <span className="text-sm text-slate-300 truncate">{userEmail}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all duration-150 rounded-lg"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            Abmelden
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {[...mainNav, ...verwaltungNav].find((i) => isActive(i.path))?.label ?? "Admin"}
          </h1>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
