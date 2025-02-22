
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HeartPulse, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleNewAssessment = () => {
    navigate('/');
  };

  return (
    <header className="bg-pulse-800 border-b border-white/10">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-pulse-300" />
          <span className="font-semibold text-pulse-100">Pulse</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleNewAssessment}
            className="text-pulse-300 hover:text-pulse-100"
          >
            New Assessment
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-pulse-300 hover:text-pulse-100"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
