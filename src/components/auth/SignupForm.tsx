
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignupFormProps {
  onToggleAuthState: () => void;
}

export const SignupForm = ({ onToggleAuthState }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
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
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your registration",
        });
        navigate('/company-onboarding');
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
