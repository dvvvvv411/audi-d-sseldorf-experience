import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import Index from "./pages/Index.tsx";
import Auth from "./pages/Auth.tsx";
import AdminLayout from "./pages/AdminLayout.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import AdminVerkaeufer from "./pages/AdminVerkaeufer.tsx";
import AdminBrandings from "./pages/AdminBrandings.tsx";
import AdminFahrzeugbestand from "./pages/AdminFahrzeugbestand.tsx";
import Gebrauchtwagen from "./pages/Gebrauchtwagen.tsx";
import Impressum from "./pages/rechtliches/Impressum.tsx";
import Rechtliches from "./pages/rechtliches/Rechtliches.tsx";
import Datenschutzinformation from "./pages/rechtliches/Datenschutzinformation.tsx";
import CookieRichtlinie from "./pages/rechtliches/CookieRichtlinie.tsx";
import Barrierefreiheit from "./pages/rechtliches/Barrierefreiheit.tsx";
import DigitalServicesAct from "./pages/rechtliches/DigitalServicesAct.tsx";
import EuDataAct from "./pages/rechtliches/EuDataAct.tsx";
import NotFound from "./pages/NotFound.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gebrauchtwagen" element={<Gebrauchtwagen />} />
          <Route path="/rechtliches" element={<Rechtliches />} />
          <Route path="/rechtliches/impressum" element={<Impressum />} />
          <Route path="/rechtliches/datenschutzinformation" element={<Datenschutzinformation />} />
          <Route path="/rechtliches/cookie-richtlinie" element={<CookieRichtlinie />} />
          <Route path="/rechtliches/barrierefreiheit" element={<Barrierefreiheit />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="verkaeufer" element={<AdminVerkaeufer />} />
            <Route path="brandings" element={<AdminBrandings />} />
            <Route path="fahrzeugbestand" element={<AdminFahrzeugbestand />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
