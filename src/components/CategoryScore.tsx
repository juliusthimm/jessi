
import { Progress } from "@/components/ui/progress";

type CategoryScoreProps = {
  title: string;
  score: number;
  description?: string;
};

export const CategoryScore = ({ title, score, description }: CategoryScoreProps) => {
  return (
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-4">
        <Progress value={score} className="h-2" />
        <div className="flex justify-between items-center">
          <p className="text-2xl font-bold text-pulse-100">{score}%</p>
          {description && (
            <p className="text-sm text-pulse-300 max-w-[70%]">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
