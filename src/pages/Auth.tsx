
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Footer";
import { AuthState, UserMode } from "@/types/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mode, setMode] = useState<UserMode>("personal");
  const [loading, setLoading] = useState(false);
  const [authState, setAuthState] = useState<AuthState>("LOGIN");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: "LOGIN" | "SIGNUP") => {
    try {
      setLoading(true);

      if (type === "LOGIN") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You've successfully logged in",
          });
          navigate("/");
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              mode: mode,
            },
          },
        });

        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else if (data?.user?.identities?.length === 0) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please log in instead.",
            variant: "destructive",
          });
        } else {
          // After successful signup, update the user's profile with their selected mode
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              mode: mode,
            });

          if (profileError) {
            toast({
              title: "Error",
              description: "Failed to set user mode",
              variant: "destructive",
            });
            return;
          }

          if (mode === 'company') {
            setAuthState('CREATE_COMPANY');
          } else {
            toast({
              title: "Check your email",
              description: "We've sent you a confirmation link to complete your registration",
            });
          }
        }
      }
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

  const handleCreateCompany = async () => {
    try {
      setLoading(true);

      // Insert the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{ name: companyName }])
        .select()
        .single();

      if (companyError || !companyData) {
        throw new Error(companyError?.message || "Failed to create company");
      }

      // Add the user as an admin
      const { error: memberError } = await supabase
        .from('company_members')
        .insert([{
          company_id: companyData.id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'admin'
        }]);

      if (memberError) {
        throw new Error(memberError.message);
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

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50">
              <HeartPulse className="h-8 w-8 text-pulse-300" />
            </div>
            <h1 className="text-3xl font-bold">Welcome to Pulse</h1>
            {authState === 'CREATE_COMPANY' ? (
              <p className="text-pulse-300">Create your company profile</p>
            ) : (
              <p className="text-pulse-300">Sign in or create an account to continue</p>
            )}
          </div>

          <div className="space-y-4">
            {authState === 'CREATE_COMPANY' ? (
              <>
                <Button
                  variant="ghost"
                  className="mb-4"
                  onClick={() => setAuthState('SIGNUP')}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
              </>
            ) : (
              <>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 border-white/20"
                />

                {authState === 'SIGNUP' && (
                  <div className="p-4 bg-white/5 rounded-lg space-y-3">
                    <Label className="text-sm font-medium">Account Type</Label>
                    <RadioGroup
                      value={mode}
                      onValueChange={(value) => setMode(value as UserMode)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="personal" id="personal" />
                        <Label htmlFor="personal">Personal Account</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="company" id="company" />
                        <Label htmlFor="company">Company Account</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <div className="space-y-2">
                  <Button
                    className="w-full bg-pulse-700 hover:bg-pulse-600"
                    onClick={() => handleAuth(authState === 'LOGIN' ? 'LOGIN' : 'SIGNUP')}
                    disabled={loading}
                  >
                    {loading ? "Processing..." : (authState === 'LOGIN' ? "Sign In" : "Create Account")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full hover:bg-pulse-700"
                    onClick={() => setAuthState(authState === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                    disabled={loading}
                  >
                    {authState === 'LOGIN' ? "Create Account" : "Sign In Instead"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
