
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Analysis from "@/pages/Analysis";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyOnboarding from "@/pages/CompanyOnboarding";
import HRReports from "@/pages/HRReports";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { MainLayout } from "@/components/layouts/MainLayout";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!isAuthenticated ? <Index /> : <Navigate to="/home" />} />
        <Route
          path="/auth"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/home" />}
        />
        
        {/* Protected routes with MainLayout */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/auth" />}>
          <Route path="/home" element={<Home />} />
          <Route path="/analysis/:conversationId" element={<Analysis />} />
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/company-onboarding" element={<CompanyOnboarding />} />
          <Route path="/hr-reports" element={<HRReports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 page with MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
