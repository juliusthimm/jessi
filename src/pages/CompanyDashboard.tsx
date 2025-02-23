
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Users, Shield, UserPlus, Mail } from "lucide-react";
import { Footer } from "@/components/Footer";

interface CompanyMember {
  id: string;
  user_id: string;
  role: 'admin' | 'hr' | 'employee';
  profiles: {
    username?: string;
  } | null;
}

interface Company {
  id: string;
  name: string;
  members: CompanyMember[];
}

const CompanyDashboard = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from('company_members')
        .select(`
          company:companies (
            id,
            name
          ),
          role
        `)
        .eq('user_id', user.id)
        .single();

      if (companyError || !companyData?.company) {
        toast({
          title: "Error",
          description: "Failed to fetch company data",
          variant: "destructive",
        });
        return;
      }

      const { data: members, error: membersError } = await supabase
        .from('company_members')
        .select(`
          id,
          user_id,
          role,
          profiles:profiles (
            username
          )
        `)
        .eq('company_id', companyData.company.id);

      if (membersError) {
        toast({
          title: "Error",
          description: "Failed to fetch company members",
          variant: "destructive",
        });
        return;
      }

      setCompany({
        id: companyData.company.id,
        name: companyData.company.name,
        members: members || [],
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    try {
      if (!company) return;

      const { error } = await supabase
        .from('company_invites')
        .insert([{
          company_id: company.id,
          email: inviteEmail,
          token: crypto.randomUUID(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        }]);

      if (error) throw error;

      toast({
        title: "Invite sent",
        description: `Invitation sent to ${inviteEmail}`,
      });
      setInviteEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invite",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Company Found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="h-8 w-8" />
              {company.name}
            </h1>
            <p className="text-pulse-300 mt-2">Company Management Dashboard</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-pulse-700/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Members
            </h2>
            <div className="space-y-4">
              {company.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-pulse-600/50 rounded"
                >
                  <div>
                    <p className="font-medium">{member.profiles?.username || 'Anonymous User'}</p>
                    <p className="text-sm text-pulse-300">{member.role}</p>
                  </div>
                  {member.role !== 'admin' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-pulse-500/50"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Manage Role
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-pulse-700/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Team Members
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-white/10 border-white/20"
                />
                <Button
                  onClick={handleInvite}
                  disabled={!inviteEmail}
                  className="bg-pulse-600 hover:bg-pulse-500"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyDashboard;
