
import { Progress } from "@/components/ui/progress";

export const WellbeingScore = ({ score }: { score: number }) => {
  return (
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-2">Overall Wellbeing Score</h3>
      <div className="space-y-4">
        <Progress value={score} className="h-3" />
        <p className="text-3xl font-bold text-pulse-100">{score}%</p>
      </div>
    </div>
  );
};
