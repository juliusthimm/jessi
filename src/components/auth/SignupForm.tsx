
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserMode } from "@/types/auth";

interface SignupFormProps {
  onToggleAuthState: () => void;
  onCompanyCreation: () => void;
}

export const SignupForm = ({ onToggleAuthState, onCompanyCreation }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<UserMode>("personal");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async () => {
    try {
      setLoading(true);
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
          onCompanyCreation();
        } else {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link to complete your registration",
          });
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

  return (
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
      <div className="space-y-2">
        <Button
          className="w-full bg-pulse-700 hover:bg-pulse-600"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Account"}
        </Button>
        <Button
          variant="ghost"
          className="w-full hover:bg-pulse-700"
          onClick={onToggleAuthState}
          disabled={loading}
        >
          Sign In Instead
        </Button>
      </div>
    </>
  );
};
