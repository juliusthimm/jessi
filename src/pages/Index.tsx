
import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { WellbeingScore } from "@/components/WellbeingScore";
import { ActionStep } from "@/components/ActionStep";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";

const Index = () => {
  const [stage, setStage] = useState<"welcome" | "assessment" | "report">("welcome");

  const mockReport = {
    score: 72,
    actionSteps: [
      {
        title: "Morning Mindfulness",
        description: "Start your day with 10 minutes of meditation to reduce stress levels.",
      },
      {
        title: "Work-Life Balance",
        description: "Set clear boundaries between work and personal time.",
      },
      {
        title: "Social Connection",
        description: "Schedule regular check-ins with friends or family members.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        {stage === "welcome" && (
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-pulse-700/50 mb-8">
              <HeartPulse className="h-8 w-8 text-pulse-300" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Wellbeing Pulse Check
            </h1>
            <p className="text-lg text-pulse-300 max-w-2xl mx-auto">
              Have a conversation with our AI assistant to assess your mental wellbeing
              and receive personalized recommendations.
            </p>
            <Button
              size="lg"
              className="bg-pulse-700 hover:bg-pulse-600 text-white"
              onClick={() => setStage("assessment")}
            >
              Start Assessment
            </Button>
          </div>
        )}

        {stage === "assessment" && (
          <div className="animate-fadeIn">
            <ChatInterface onComplete={() => setStage("report")} />
          </div>
        )}

        {stage === "report" && (
          <div className="space-y-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-center mb-8">Your Wellbeing Report</h2>
            
            <WellbeingScore score={mockReport.score} />
            
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Recommended Action Steps</h3>
              <div className="grid gap-4">
                {mockReport.actionSteps.map((step, index) => (
                  <ActionStep key={index} {...step} />
                ))}
              </div>
            </div>

            <div className="text-center pt-8">
              <Button
                variant="outline"
                onClick={() => setStage("welcome")}
                className="hover:bg-pulse-700"
              >
                Start New Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
