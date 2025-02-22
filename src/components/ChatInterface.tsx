
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Mic, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CallTranscript } from "./CallTranscript";

type Message = {
  id: number;
  text: string;
  isAi: boolean;
};

export const ChatInterface = ({ onComplete }: { onComplete: () => void }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [apiKeyData, setApiKeyData] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Connected",
        description: "Ready to start the conversation",
      });
    },
    onMessage: (message) => {
      if (message.type === "speech_started") {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: message.text || "...",
          isAi: true
        }]);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });


  useEffect(() => {
    const configureElevenLabs = async () => {
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .functions.invoke('get-elevenlabs-key');
  
      if (apiKeyError || !apiKeyData?.apiKey) {
        toast({
          title: "Error",
          description: "Could not retrieve ElevenLabs API key",
          variant: "destructive",
        });
        return;
      } 
      setIsConfigured(true);
      console.log(apiKeyData.apiKey);
      setApiKeyData(apiKeyData.apiKey);
    }

    configureElevenLabs();

  }, []);


  
  const startConversation = async () => {
    try {

      const conversationId = await conversation.startSession({
        apiKey: apiKeyData,
        agentId: "AOtHugEpQt093WLjDkRY",
      });
      setConversationId(conversationId);
      setIsConfigured(true);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to ElevenLabs",
        variant: "destructive",
      });
    }
  };

  const handleStartCall = async () => {
    try {
      await startConversation();
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsCallActive(true);
      toast({
        title: "Call Started",
        description: "You can now speak with the AI assistant",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const handleEndAssessment = async () => {
    try {
      await conversation.endSession();
      console.log(conversationId);
      // Navigate to analysis page with the conversation ID
      if (conversationId) {
        navigate(`/analysis/${conversationId}`);
      }
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end assessment",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-pulse-700 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-pulse-300" />
            </div>
            <div>
              <h3 className="font-semibold">Wellbeing Assistant</h3>
              <p className="text-sm text-pulse-300">AI-powered assessment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConfigured && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEndAssessment}
                className="text-pulse-300 hover:text-pulse-100"
              >
                <Settings className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-pulse-300 hover:text-pulse-100"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {!isConfigured ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-pulse-300"></div>
          <p className="text-pulse-300 mt-4">Connecting to ElevenLabs...</p>
        </div>
      ) : (
        <>
          {/* Chat messages */}
          <CallTranscript messages={messages} />

          {/* Microphone input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={isCallActive ? undefined : handleStartCall}
                className={`h-12 w-12 rounded-full ${
                  isCallActive ? "bg-red-500/20 hover:bg-red-500/30" : ""
                }`}
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-sm text-pulse-300 mt-2 text-center">
              {isCallActive ? "Listening..." : "Click to start call"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
