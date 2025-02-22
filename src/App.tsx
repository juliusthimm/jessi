
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Analysis from "@/pages/Analysis";
import NotFound from "@/pages/NotFound";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";

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
        <Route
          path="/"
          element={isAuthenticated ? <Index /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/" />}
        />
        <Route
          path="/analysis/:conversationId"
          element={isAuthenticated ? <Analysis /> : <Navigate to="/auth" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
