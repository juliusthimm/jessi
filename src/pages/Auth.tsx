
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HeartPulse } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: "LOGIN" | "SIGNUP") => {
    try {
      setLoading(true);
      const { error } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: type === "LOGIN" ? "Welcome back!" : "Account created!",
          description:
            type === "LOGIN"
              ? "You've successfully logged in"
              : "Please check your email to verify your account",
        });
        if (type === "LOGIN") {
          navigate("/");
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
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50">
            <HeartPulse className="h-8 w-8 text-pulse-300" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to Pulse</h1>
          <p className="text-pulse-300">Sign in or create an account to continue</p>
        </div>

        <div className="space-y-4">
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
              onClick={() => handleAuth("LOGIN")}
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign In"}
            </Button>
            <Button
              variant="outline"
              className="w-full hover:bg-pulse-700"
              onClick={() => handleAuth("SIGNUP")}
              disabled={loading}
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
