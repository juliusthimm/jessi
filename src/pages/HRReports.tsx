
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
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        console.log("Fetching user profile...");
        const { data: userCompany, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .maybeSingle();

        console.log("User profile result:", { userCompany, profileError });

        if (profileError) {
          console.error("Profile error:", profileError);
          throw profileError;
        }

        if (!userCompany?.company_id) {
          console.error("No company ID found");
          throw new Error('No company found');
        }

        console.log("Checking HR access for company:", userCompany.company_id);
        const { data: hasAccess, error: accessError } = await supabase
          .rpc('has_hr_access', { company_id: userCompany.company_id });

        console.log("HR access check result:", { hasAccess, accessError });

        if (accessError) {
          console.error("Access check error:", accessError);
          throw accessError;
        }

        if (!hasAccess) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to view HR reports",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        console.log("Fetching analyses...");
        const { data: analysesData, error: analysesError } = await supabase
          .from('conversation_analyses')
          .select(`
            id,
            conversation_id,
            user_id,
            analysis,
            created_at,
            user_profile:profiles(username)
          `)
          .eq('company_id', userCompany.company_id)
          .eq('status', 'done')
          .order('created_at', { ascending: false });

        console.log("Analyses result:", { analysesData, analysesError });

        if (analysesError) {
          console.error("Analyses error:", analysesError);
          throw analysesError;
        }
        
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
        console.error("Overall error:", error);
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
  }, [toast, navigate]);

  const calculateAverageScores = () => {
    if (!analyses.length) return {};
    
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    analyses.forEach(record => {
      if (record.analysis?.data_collection_results) {
        Object.entries(record.analysis.data_collection_results).forEach(([key, data]) => {
          if (data?.value !== undefined && data.value !== null) {
            totals[key] = (totals[key] || 0) + data.value;
            counts[key] = (counts[key] || 0) + 1;
          }
        });
      }
    });

    return Object.keys(totals).reduce((acc, key) => {
      acc[key] = counts[key] > 0 ? totals[key] / counts[key] : null;
      return acc;
    }, {} as Record<string, number | null>);
  };

  const averageScores = calculateAverageScores();

  if (loading) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Team Wellbeing Reports</h1>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-pulse-700/50 border border-white/10">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-pulse-600 data-[state=active]:text-pulse-100"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="individual" 
                className="data-[state=active]:bg-pulse-600 data-[state=active]:text-pulse-100"
              >
                Individual Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                <h2 className="text-xl font-semibold mb-4">Team Overview</h2>
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
            </TabsContent>

            <TabsContent value="individual">
              <div className="space-y-6">
                {analyses.map((record) => (
                  <div 
                    key={record.id} 
                    className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10"
                  >
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-pulse-100">
                        {record.user_profile?.username || 'Anonymous User'}
                      </h3>
                      <p className="text-pulse-300">
                        {new Date(record.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
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
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default HRReports;
