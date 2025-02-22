
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { WELLBEING_TOPICS } from "@/constants/wellbeing-topics";
import { CategoryScore } from "@/components/CategoryScore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ConversationResponse } from "@/types/elevenlabs";

const POLLING_INTERVAL = 2000;

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
        if (!loading) return;
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
  }, [conversationId, loading, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-pulse-300">No analysis data available</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (analysis.status === 'processing') {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300 mx-auto"></div>
            <p className="text-pulse-300">Analyzing conversation...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (analysis.status === 'error') {
    return (
      <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">An error occurred while analyzing the conversation</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pulse-800 text-pulse-100 flex flex-col">
      <Header />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Wellbeing Analysis</h1>
          
          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Conversation Summary</h2>
            <div className="space-y-2">
              <div className="flex gap-8">
                <p className="text-pulse-300">
                  <span className="font-medium text-pulse-100">Duration:</span>{" "}
                  {analysis.metadata.call_duration_secs} seconds
                </p>
                <p className="text-pulse-300">
                  <span className="font-medium text-pulse-100">Messages:</span>{" "}
                  {analysis.transcript.length} exchanges
                </p>
              </div>
              {analysis.analysis?.transcript_summary && (
                <p className="text-pulse-300 mt-4 leading-relaxed">
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
                    score={topicData?.value ?? null}
                    description={topic.description}
                    rationale={topicData?.rationale}
                  />
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
            <h2 className="text-xl font-semibold mb-4">Conversation Transcript</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="transcript" className="border-white/10">
                <AccordionTrigger className="text-pulse-100 hover:text-pulse-100 hover:no-underline">
                  View Full Conversation
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-4">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analysis;
