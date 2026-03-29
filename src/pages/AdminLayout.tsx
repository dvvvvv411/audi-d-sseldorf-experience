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

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Verkäufer", icon: Users, path: "/admin/verkaeufer" },
  { label: "Brandings", icon: Building2, path: "/admin/brandings" },
  { label: "Fahrzeugbestand", icon: Car, path: "/admin/fahrzeugbestand" },
  { label: "Anfragen", icon: MessageSquare, path: "/admin/anfragen" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [neuCount, setNeuCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("anfragen")
        .select("id", { count: "exact", head: true })
        .eq("status", "NEU");
      setNeuCount(count ?? 0);
    };
    fetchCount();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 admin-theme">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-black flex flex-col transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <div className="text-white">
            <AudiRingsSmall />
          </div>
          <p className="text-xs text-gray-400 tracking-widest uppercase mt-3">Verwaltung</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-none transition-colors ${
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === "Anfragen" && neuCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {neuCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors rounded-none"
          >
            <LogOut className="w-5 h-5" />
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
            {navItems.find((i) => i.path === location.pathname)?.label ?? "Admin"}
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
