
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
type CategoryScoreProps = {
  title: string;
  score: number | null;
  description?: string;
  rationale?: string;
};
export const CategoryScore = ({
  title,
  score,
  description,
  rationale
}: CategoryScoreProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-slate-50">{title}</h3>
      <div className="space-y-6">
        {score !== null ? <Progress value={score} className="h-2" /> : <div className="h-2 bg-pulse-700/30 rounded-full" />}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {score !== null ? <p className="text-2xl font-bold text-pulse-100">{score}</p> : <p className="text-lg font-medium text-pulse-300">Not Calculated</p>}
            {description && <p className="text-sm text-pulse-300 max-w-[90%]">{description}</p>}
          </div>
          {rationale && <button onClick={() => setIsExpanded(!isExpanded)} className="text-pulse-300 hover:text-pulse-100 transition-colors">
              <ChevronDown className={cn("h-5 w-5 transition-transform duration-200", isExpanded && "rotate-180")} />
            </button>}
        </div>
        {rationale && isExpanded && <div className="mt-4 p-4 rounded-lg bg-pulse-700/30 text-sm text-pulse-200">
            <h4 className="font-medium mb-2 text-pulse-100">Analysis Rationale:</h4>
            <p>{score !== null ? rationale : "Not enough data to analyse this datapoint."}</p>
          </div>}
      </div>
    </div>;
};
