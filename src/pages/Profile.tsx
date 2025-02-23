
import { UserProfileForm } from "@/components/auth/UserProfileForm";
import { AnalysisHistory } from "@/components/AnalysisHistory";

const Profile = () => {
  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100">
      <main className="p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <UserProfileForm />
          <AnalysisHistory />
        </div>
      </main>
    </div>
  );
};

export default Profile;
