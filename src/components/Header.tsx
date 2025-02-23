
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut, Building2, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Header = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch user profile and company data in one query using joins
        const { data } = await supabase
          .from('profiles')
          .select(`
            username,
            companies:company_id (
              name
            )
          `)
          .eq('id', user.id)
          .single();

        if (data?.username) {
          setUsername(data.username);
        }
        if (data?.companies?.name) {
          setCompanyName(data.companies.name);
        }
      }
    };
    getUserData();
  }, []);

  const handleHome = () => {
    if (username) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleCompanyDashboard = () => {
    if (companyName) {
      navigate('/company');
    } else {
      navigate('/company-onboarding');
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return <header className="bg-pulse-800 border-b border-white/10">
      <div className="container max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={handleHome} style={{
        cursor: "pointer"
      }}>
          <img alt="Pulsato Logo" src="/lovable-uploads/bdf1227e-a3b8-444a-b52c-7f987b6b07e1.png" className="h-10 w-10" />
          <span className="font-semibold text-pulse-100 text-xl">Pulsato</span>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={handleCompanyDashboard} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            <Building2 className="h-5 w-5 mr-2" />
            {companyName || 'Create team'}
          </Button>
          <Button onClick={handleProfile} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            <User className="h-5 w-5 mr-2" />
            {username || 'Profile'}
          </Button>
          <Button size="icon" onClick={handleLogout} className="bg-pulse-700 hover:bg-pulse-600 text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>;
};
