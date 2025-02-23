
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import type { ConversationResponse } from "@/types/elevenlabs";
import { LoadingSpinner } from "@/components/hr/LoadingSpinner";
import { DateFilter } from "@/components/hr/DateFilter";
import { TeamOverview } from "@/components/hr/TeamOverview";
import { IndividualReports } from "@/components/hr/IndividualReports";
import { isWithinInterval } from "date-fns";

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
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | null>(null);
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
    
    const filteredAnalyses = dateRange 
      ? analyses.filter(record => {
          const recordDate = new Date(record.created_at);
          return isWithinInterval(recordDate, {
            start: dateRange.start,
            end: dateRange.end
          });
        })
      : analyses;
    
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    filteredAnalyses.forEach(record => {
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

  const filteredAnalyses = dateRange
    ? analyses.filter(record => {
        const recordDate = new Date(record.created_at);
        return isWithinInterval(recordDate, {
          start: dateRange.start,
          end: dateRange.end
        });
      })
    : analyses;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Team Wellbeing Reports</h1>
            <DateFilter dateRange={dateRange} setDateRange={setDateRange} />
          </div>

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
              <TeamOverview averageScores={averageScores} dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="individual">
              <IndividualReports analyses={filteredAnalyses} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default HRReports;
