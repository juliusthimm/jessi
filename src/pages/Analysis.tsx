
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { CategoryScore } from "@/components/CategoryScore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ConversationResponse } from "@/types/elevenlabs";

const POLLING_INTERVAL = 2000; // Poll every 2 seconds

const Analysis = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<ConversationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let pollInterval: number | null = null;

    const fetchAnalysis = async () => {
      try {
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .functions.invoke('get-elevenlabs-key');

        if (apiKeyError || !apiKeyData?.apiKey) {
          throw new Error("Could not retrieve API key");
        }

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

        const data: ConversationResponse = await response.json();
        setAnalysis(data);

        // If status is 'done' or 'error', stop polling
        if (data.status !== 'processing') {
          if (pollInterval) {
            window.clearInterval(pollInterval);
          }
          setLoading(false);
        }
      } catch (error) {
        if (pollInterval) {
          window.clearInterval(pollInterval);
        }
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load conversation analysis",
          variant: "destructive",
        });
      }
    };

    // Initial fetch
    fetchAnalysis();

    // Start polling if needed
    pollInterval = window.setInterval(fetchAnalysis, POLLING_INTERVAL);

    // Cleanup
    return () => {
      if (pollInterval) {
        window.clearInterval(pollInterval);
      }
    };
  }, [conversationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-pulse-300">No analysis data available</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4 bg-pulse-700 hover:bg-pulse-600"
          >
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  if (analysis.status === 'processing') {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300 mx-auto"></div>
          <p className="text-pulse-300">Analyzing conversation...</p>
        </div>
      </div>
    );
  }

  if (analysis.status === 'error') {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">An error occurred while analyzing the conversation</p>
          <Button
            onClick={() => navigate('/')}
            className="mt-4 bg-pulse-700 hover:bg-pulse-600"
          >
            Start New Assessment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Wellbeing Analysis</h1>
        
        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Conversation Summary</h2>
          <div className="space-y-2">
            <p className="text-pulse-300">
              Duration: {analysis.metadata.call_duration_secs} seconds
            </p>
            <p className="text-pulse-300">
              Messages: {analysis.transcript.length} exchanges
            </p>
            {analysis.analysis?.transcript_summary && (
              <p className="text-pulse-300 mt-4">
                {analysis.analysis.transcript_summary}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Topic Analysis</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(WELLBEING_TOPICS).map(([key, topic]) => {
              const topicData = analysis.analysis?.data_collection_results?.[topic.id];
              return (
                <CategoryScore
                  key={topic.id}
                  title={topic.title}
                  score={topicData?.value || 0}
                  description={topicData?.rationale || topic.description}
                />
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Conversation Transcript</h2>
          <div className="space-y-4">
            {analysis.transcript.map((turn, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  turn.role === 'user' ? 'bg-pulse-700/30' : 'bg-pulse-600/30'
                }`}
              >
                <p className="text-sm text-pulse-300 mb-1">
                  {turn.role === 'user' ? 'You' : 'Assistant'}
                </p>
                <p className="text-pulse-100">{turn.message}</p>
              </div>
            ))}
          </div>
        </div>

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
