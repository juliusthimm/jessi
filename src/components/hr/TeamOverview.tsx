
import { CategoryScore } from "@/components/CategoryScore";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { ConversationResponse } from "@/types/elevenlabs";
import { format } from "date-fns";

interface AnalysisRecord {
  id: string;
  conversation_id: string;
  user_id: string;
  analysis: ConversationResponse['analysis'];
  created_at: string;
  user_profile: {
    username: string | null;
  } | null;
}

interface TeamOverviewProps {
  averageScores: Record<string, number | null>;
  dateRange: { start: Date; end: Date } | null;
  analyses: AnalysisRecord[];
}

export const TeamOverview = ({ averageScores, dateRange, analyses }: TeamOverviewProps) => {
  // Count unique user IDs who contributed to any score
  const uniqueContributors = Object.values(analyses).length;

  // Round scores to nearest integer
  const roundedScores = Object.entries(averageScores).reduce((acc, [key, value]) => {
    acc[key] = value !== null ? Math.round(value) : null;
    return acc;
  }, {} as Record<string, number | null>);

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
            const score = roundedScores[topic.id];
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
