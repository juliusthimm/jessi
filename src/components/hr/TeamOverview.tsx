
import { CategoryScore } from "@/components/CategoryScore";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { format } from "date-fns";

interface TeamOverviewProps {
  averageScores: Record<string, number | null>;
  dateRange: { start: Date; end: Date } | null;
}

export const TeamOverview = ({ averageScores, dateRange }: TeamOverviewProps) => {
  // Count unique user IDs who contributed to any score
  const uniqueContributors = Object.values(averageScores).filter(score => score !== null).length;

  return (
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">
            Team Overview {dateRange && `from ${format(dateRange.start, "PPP")} to ${format(dateRange.end, "PPP")}`}
          </h2>
          <p className="text-sm text-pulse-300">
            Based on reports from {uniqueContributors} team member{uniqueContributors !== 1 ? 's' : ''}
          </p>
        </div>
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
    </div>
  );
};
