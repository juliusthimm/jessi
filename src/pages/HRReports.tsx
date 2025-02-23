
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { WellbeingScore } from "@/components/WellbeingScore";
import { CategoryScore } from "@/components/CategoryScore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const HRReports = () => {
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const { data: userCompany } = await supabase
          .from('profiles')
          .select('company_id')
          .single();

        if (!userCompany?.company_id) {
          throw new Error('No company found');
        }

        const { data: analysesData, error } = await supabase
          .from('conversation_analyses')
          .select(`
            id,
            conversation_id,
            user_id,
            analysis,
            created_at,
            user_profile:user_id(username)
          `)
          .eq('company_id', userCompany.company_id)
          .eq('status', 'done')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Transform the data to match the AnalysisRecord type
        const typedData: AnalysisRecord[] = (analysesData || []).map(record => ({
          id: record.id,
          conversation_id: record.conversation_id,
          user_id: record.user_id,
          analysis: record.analysis as ConversationResponse['analysis'],
          created_at: record.created_at,
          user_profile: record.user_profile as { username: string | null } | null
        }));
        
        setAnalyses(typedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reports",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [toast]);

  const calculateAverageScores = () => {
    if (!analyses.length) return {};
    
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    analyses.forEach(record => {
      if (record.analysis?.data_collection_results) {
        Object.entries(record.analysis.data_collection_results).forEach(([key, data]) => {
          if (data?.value !== undefined) {
            totals[key] = (totals[key] || 0) + data.value;
            counts[key] = (counts[key] || 0) + 1;
          }
        });
      }
    });

    return Object.keys(totals).reduce((acc, key) => {
      acc[key] = totals[key] / counts[key];
      return acc;
    }, {} as Record<string, number>);
  };

  const averageScores = calculateAverageScores();

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Team Wellbeing Reports</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="individual">Individual Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>
                Average scores across all team members
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {Object.entries(WELLBEING_TOPICS).map(([key, topic]) => {
                const score = averageScores[topic.id];
                return (
                  <CategoryScore
                    key={topic.id}
                    title={topic.title}
                    score={score ?? null}
                    description={topic.description}
                  />
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <div className="space-y-6">
            {analyses.map((record) => (
              <Card key={record.id}>
                <CardHeader>
                  <CardTitle>{record.user_profile?.username || 'Anonymous User'}</CardTitle>
                  <CardDescription>
                    {new Date(record.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRReports;
