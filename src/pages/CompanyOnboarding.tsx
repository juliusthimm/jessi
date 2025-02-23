
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type OnboardingState = 'CHOOSE' | 'CREATE' | 'JOIN';

const CompanyOnboarding = () => {
  const [onboardingState, setOnboardingState] = useState<OnboardingState>('CHOOSE');
  const [companyName, setCompanyName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateCompany = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        navigate('/auth');
        return;
      }

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName }])
        .select()
        .single();

      if (companyError || !companyData) {
        throw new Error(companyError?.message || "Failed to create company");
      }

      const { error: memberError } = await supabase
        .from('company_members')
        .insert([{
          company_id: companyData.id,
          user_id: user.user.id,
          role: 'admin'
        }]);

      if (memberError) {
        throw new Error(memberError.message);
      }

      // Update user profile to set company mode
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ mode: 'company' })
        .eq('id', user.user.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      toast({
        title: "Company created",
        description: "Your company has been created successfully",
      });
      navigate("/company");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create company",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCompany = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data: invite, error: inviteError } = await supabase
        .from('company_invites')
        .select('company_id, companies(name)')
        .eq('token', inviteCode)
        .single();

      if (inviteError || !invite) {
        toast({
          title: "Invalid invite code",
          description: "Please check your invite code and try again",
          variant: "destructive",
        });
        return;
      }

      const { error: memberError } = await supabase
        .from('company_members')
        .insert([{
          company_id: invite.company_id,
          user_id: user.id,
          role: 'employee'
        }]);

      if (memberError) {
        throw new Error(memberError.message);
      }

      // Update user profile to set company mode
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ mode: 'company' })
        .eq('id', user.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      toast({
        title: "Welcome!",
        description: "You've successfully joined the company",
      });
      navigate("/company");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join company",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50">
              <HeartPulse className="h-8 w-8 text-pulse-300" />
            </div>
            <h1 className="text-3xl font-bold">Company Setup</h1>
            <p className="text-pulse-300">Create or join a company to get started</p>
          </div>

          <div className="space-y-4">
            {onboardingState === 'CHOOSE' && (
              <div className="p-4 bg-white/5 rounded-lg space-y-4">
                <RadioGroup
                  defaultValue="create"
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      className="w-full bg-pulse-700 hover:bg-pulse-600"
                      onClick={() => setOnboardingState('CREATE')}
                    >
                      Create a Company
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      className="w-full bg-pulse-700 hover:bg-pulse-600"
                      onClick={() => setOnboardingState('JOIN')}
                    >
                      Join a Company
                    </Button>
                  </div>
                </RadioGroup>
              </div>
            )}

            {onboardingState === 'CREATE' && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setOnboardingState('CHOOSE')}
                  className="mb-4"
                >
                  Back
                </Button>
                <Input
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="bg-white/10 border-white/20"
                />
                <Button
                  className="w-full bg-pulse-700 hover:bg-pulse-600"
                  onClick={handleCreateCompany}
                  disabled={loading || !companyName}
                >
                  {loading ? "Creating..." : "Create Company"}
                </Button>
              </div>
            )}

            {onboardingState === 'JOIN' && (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => setOnboardingState('CHOOSE')}
                  className="mb-4"
                >
                  Back
                </Button>
                <Input
                  type="text"
                  placeholder="Enter Invite Code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="bg-white/10 border-white/20"
                />
                <Button
                  className="w-full bg-pulse-700 hover:bg-pulse-600"
                  onClick={handleJoinCompany}
                  disabled={loading || !inviteCode}
                >
                  {loading ? "Joining..." : "Join Company"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CompanyOnboarding;
