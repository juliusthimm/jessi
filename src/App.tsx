
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Auth from "@/pages/Auth";
import Index from "@/pages/Index";
import CompanyDashboard from "@/pages/CompanyDashboard";
import CompanyOnboarding from "@/pages/CompanyOnboarding";
import HRReports from "@/pages/HRReports";
import Analysis from "@/pages/Analysis";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company-onboarding" element={<CompanyOnboarding />} />
        <Route path="/hr-reports" element={<HRReports />} />
        <Route path="/analysis/:conversationId" element={<Analysis />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
