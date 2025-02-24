
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SignupFormProps {
  onToggleAuthState: () => void;
}

export const SignupForm = ({ onToggleAuthState }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async () => {
    try {
      setLoading(true);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) {
        toast({
          title: "Error",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData?.user?.identities?.length === 0) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            username,
          })
          .eq('id', authData.user.id);

        if (profileError) {
          toast({
            title: "Error",
            description: "Failed to update profile information",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link to complete your registration",
      });
      navigate('/company-onboarding');
      
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">First Name</Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your first name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-white/10 border-white/20"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/10 border-white/20"
        />
      </div>

      <div className="space-y-2 pt-4">
        <Button
          variant="ghost"
          className="w-full text-pulse-300 hover:bg-pulse-700"
          onClick={handleSignup}
          disabled={loading || !email || !password || !username}
        >
          {loading ? "Processing..." : "Create Account"}
        </Button>
        <Button
          variant="ghost"
          className="w-full text-pulse-300 hover:bg-pulse-700"
          onClick={onToggleAuthState}
          disabled={loading}
        >
          Sign In Instead
        </Button>
      </div>
    </div>
  );
};
