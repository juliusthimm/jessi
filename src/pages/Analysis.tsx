
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { CategoryScore } from "@/components/CategoryScore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type AnalysisData = {
  summary: string;
  topics: {
    [key: string]: {
      score: number;
      insights: string[];
    }
  }
};

const Analysis = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .functions.invoke('get-elevenlabs-key');

        if (apiKeyError || !apiKeyData?.apiKey) {
          throw new Error("Could not retrieve API key");
        }
        console.log(apiKeyData.apiKey);
        const response = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
          {
            headers: {
              'xi-api-key': apiKeyData.apiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }

        const data = await response.json();
        setAnalysis(data);
        console.log(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load conversation analysis",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchAnalysis();
    }
  }, [conversationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Wellbeing Analysis</h1>
        
        {analysis ? (
          <>
            <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <p className="text-pulse-300">{analysis.summary}</p>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Topic Analysis</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(WELLBEING_TOPICS).map(([key, topic]) => (
                  <CategoryScore
                    key={topic.id}
                    title={topic.title}
                    score={analysis.topics[topic.id]?.score || 0}
                    description={analysis.topics[topic.id]?.insights?.[0] || topic.description}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-pulse-300">
            No analysis data available
          </div>
        )}

        <div className="flex justify-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-pulse-700 hover:bg-pulse-600"
          >
            Start New Assessment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
