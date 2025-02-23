
import React, { useState } from "react";
import { HeartPulse } from "lucide-react";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { AuthState } from "@/types/auth";

const Auth = () => {
  const [authState, setAuthState] = useState<AuthState>("LOGIN");

  const toggleAuthState = () => {
    setAuthState(authState === "LOGIN" ? "SIGNUP" : "LOGIN");
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
            <p className="text-pulse-300">Sign in or create an account to continue</p>
          </div>

          <div className="space-y-4">
            {authState === 'LOGIN' ? (
              <LoginForm onToggleAuthState={toggleAuthState} />
            ) : (
              <SignupForm onToggleAuthState={toggleAuthState} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
