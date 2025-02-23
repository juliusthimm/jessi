
import { CategoryScore } from "@/components/CategoryScore";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import type { ConversationResponse } from "@/types/elevenlabs";

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

interface IndividualReportsProps {
  analyses: AnalysisRecord[];
}

export const IndividualReports = ({ analyses }: IndividualReportsProps) => {
  return (
    <Accordion type="single" collapsible className="space-y-4">
      {analyses.map((record) => (
        <AccordionItem
          key={record.id}
          value={record.id}
          className="p-4 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10"
        >
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-col items-start">
              <h3 className="text-lg font-semibold text-pulse-100">
                {record.user_profile?.username || 'Anonymous User'}
              </h3>
              <p className="text-sm text-pulse-300">
                {format(new Date(record.created_at), "PPP")}
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4 md:grid-cols-2 pt-4">
              {Object.entries(WELLBEING_TOPICS).map(([key, topic]) => {
                const topicData = record.analysis?.data_collection_results?.[topic.id];
                return (
                  <CategoryScore
                    key={`${record.id}-${topic.id}`}
                    title={topic.title}
                    score={topicData?.value ?? null}
                    description={topic.description}
                    rationale={topicData?.rationale}
                  />
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
