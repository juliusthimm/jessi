
import { HeartPulse } from "lucide-react";
import { UserProfileForm } from "@/components/auth/UserProfileForm";

const Profile = () => {
  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50">
              <HeartPulse className="h-8 w-8 text-pulse-300" />
            </div>
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-pulse-300">Update your profile information</p>
          </div>

          <UserProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
