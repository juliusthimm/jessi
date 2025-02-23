import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeartPulse, LogOut, Building2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
export const Header = () => {
  const navigate = useNavigate();
  const handleHome = () => {
    navigate('/');
  };
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };
  const handleNewAssessment = () => {
    navigate('/');
  };
  const handleCompanyDashboard = () => {
    navigate('/company');
  };
  const handleProfile = () => {
    navigate('/profile');
  };
  return <header className="bg-pulse-800 border-b border-white/10">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={handleHome} style={{
        cursor: "pointer"
      }}>
          <HeartPulse className="h-6 w-6 text-pulse-300" />
          <span className="font-semibold text-pulse-100">Pulsato</span>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleNewAssessment} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            New Assessment
          </Button>
          <Button onClick={handleCompanyDashboard} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            <Building2 className="h-5 w-5 mr-2" />
            Company
          </Button>
          <Button onClick={handleProfile} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            <User className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={handleLogout} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>;
};