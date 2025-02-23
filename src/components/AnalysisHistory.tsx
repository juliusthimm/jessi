
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { IndividualReports } from "@/components/hr/IndividualReports";
import type { ConversationResponse } from "@/types/elevenlabs";
import { DateFilter } from "@/components/hr/DateFilter";

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

export const AnalysisHistory = () => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('Not authenticated');
        }

        let query = supabase
          .from('conversation_analyses')
          .select(`
            id,
            conversation_id,
            user_id,
            analysis,
            created_at,
            user_profile:profiles(username)
          `)
          .eq('user_id', user.id)
          .eq('status', 'done')
          .order('created_at', { ascending: false });

        if (dateRange) {
          query = query
            .gte('created_at', dateRange.start.toISOString())
            .lte('created_at', dateRange.end.toISOString());
        }

        const { data: analysesData, error } = await query;

        if (error) throw error;

        const typedData: AnalysisRecord[] = (analysesData || []).map(record => {
          const userProfile = record.user_profile as unknown as { username: string | null }[];
          return {
            id: record.id,
            conversation_id: record.conversation_id,
            user_id: record.user_id,
            analysis: record.analysis as ConversationResponse['analysis'],
            created_at: record.created_at,
            user_profile: userProfile?.[0] ?? null
          };
        });

        setAnalyses(typedData);
      } catch (error) {
        console.error('Error fetching analyses:', error);
        toast({
          title: "Error",
          description: "Failed to load analysis history",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [toast, dateRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <IndividualReports analyses={analyses} />
    </div>
  );
};
