
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WelcomeCardProps {
  onStartAssessment: () => void;
}

export const WelcomeCard = ({ onStartAssessment }: WelcomeCardProps) => {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50 px-[5px] py-[5px]">
          <img
            alt="Pulsato Logo"
            src="/lovable-uploads/759af5a0-30c2-4e87-9faa-2aee05cdba88.png"
            className="h-14 w-14"
          />
        </div>
        <h1 className="text-3xl font-bold text-pulse-100">
          How are you doing today?
        </h1>
        <p className="text-lg text-pulse-300">
          Take a quick assessment to check your wellbeing
        </p>
        <Button
          size="lg"
          className="bg-pulse-700 hover:bg-pulse-600 text-white"
          onClick={onStartAssessment}
        >
          Start Assessment
        </Button>
      </div>
    </Card>
  );
};
