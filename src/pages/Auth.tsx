
import { useState } from "react";
import { HeartPulse } from "lucide-react";
import { Footer } from "@/components/Footer";
import { AuthState } from "@/types/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { CompanyCreationForm } from "@/components/auth/CompanyCreationForm";

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
            {authState === 'CREATE_COMPANY' ? (
              <p className="text-pulse-300">Create your company profile</p>
            ) : (
              <p className="text-pulse-300">Sign in or create an account to continue</p>
            )}
          </div>

          <div className="space-y-4">
            {authState === 'LOGIN' && (
              <LoginForm onToggleAuthState={toggleAuthState} />
            )}
            {authState === 'SIGNUP' && (
              <SignupForm
                onToggleAuthState={toggleAuthState}
                onCompanyCreation={() => setAuthState('CREATE_COMPANY')}
              />
            )}
            {authState === 'CREATE_COMPANY' && (
              <CompanyCreationForm
                onBack={() => setAuthState('SIGNUP')}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
