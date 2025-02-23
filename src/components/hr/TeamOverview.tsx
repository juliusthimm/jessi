
import { CategoryScore } from "@/components/CategoryScore";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { format } from "date-fns";

interface TeamOverviewProps {
  averageScores: Record<string, number | null>;
  dateRange: { start: Date; end: Date } | null;
}

export const TeamOverview = ({ averageScores, dateRange }: TeamOverviewProps) => {
  return (
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">
        Team Overview {dateRange && `from ${format(dateRange.start, "PPP")} to ${format(dateRange.end, "PPP")}`}
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(WELLBEING_TOPICS).map(([key, topic]) => {
          const score = averageScores[topic.id];
          return (
            <CategoryScore
              key={topic.id}
              title={topic.title}
              score={score}
              description={topic.description}
            />
          );
        })}
      </div>
    </div>
  );
};
