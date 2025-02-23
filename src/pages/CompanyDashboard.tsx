import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, LineChart } from "lucide-react";
import { TeamMembersList } from "@/components/company/TeamMembersList";
import { InviteMembers } from "@/components/company/InviteMembers";
import { CompanyRole } from "@/types/auth";
interface CompanyMember {
  id: string;
  user_id: string;
  role: CompanyRole;
  profiles: {
    username?: string;
  } | null;
}
interface Company {
  id: string;
  name: string;
  members: CompanyMember[];
  currentUserRole?: CompanyRole;
}
const CompanyDashboard = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchCompanyData();
  }, []);
  const fetchCompanyData = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      const {
        data: companyData,
        error: companyError
      } = await supabase.from('company_members').select(`
          company:companies (
            id,
            name
          ),
          role
        `).eq('user_id', user.id).single();
      if (companyError || !companyData?.company) {
        // Silently redirect to company-onboarding instead of showing error toast
        navigate('/company-onboarding');
        return;
      }
      const {
        data: members,
        error: membersError
      } = await supabase.from('company_members').select(`
          id,
          user_id,
          role,
          profiles:profiles (
            username
          )
        `).eq('company_id', companyData.company.id);
      if (membersError) {
        toast({
          title: "Error",
          description: "Failed to fetch company members",
          variant: "destructive"
        });
        return;
      }
      setCompany({
        id: companyData.company.id,
        name: companyData.company.name,
        members: members || [],
        currentUserRole: companyData.role
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
        </div>
      </div>;
  }
  if (!company) {
    return null; // Don't show any error UI, as we'll redirect in fetchCompanyData
  }
  return <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            
            {company.name}
          </h1>
          <p className="text-pulse-300 mt-2">Company settings</p>
        </div>
        {company.currentUserRole === 'hr' && <Button onClick={() => navigate('/hr-reports')} className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            HR Reports
          </Button>}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <TeamMembersList members={company.members} currentUserRole={company.currentUserRole} />
        <InviteMembers companyId={company.id} companyName={company.name} />
      </div>
    </div>;
};
export default CompanyDashboard;