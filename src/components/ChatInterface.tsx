
import { useState, useEffect } from "react";
import { MessageCircle, Mic, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: number;
  text: string;
  isAi: boolean;
};

export const ChatInterface = ({ onComplete }: { onComplete: () => void }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

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

  const startAssessment = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your ElevenLabs API key to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      await conversation.startSession({
        agentId: "default", // Replace with your actual agent ID from ElevenLabs
      });
      setIsConfigured(true);
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to connect to ElevenLabs. Please check your API key.",
        variant: "destructive",
      });
    }
  };

  const handleEndAssessment = async () => {
    await conversation.endSession();
    onComplete();
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
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <h2 className="text-xl font-semibold text-center">Welcome to Your Wellbeing Assessment</h2>
          <p className="text-pulse-300 text-center max-w-md">
            To begin, please enter your ElevenLabs API key. This is required for the voice interaction.
          </p>
          <div className="w-full max-w-md space-y-4">
            <Input
              type="password"
              placeholder="Enter your ElevenLabs API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white/10 border-white/20"
            />
            <Button
              className="w-full bg-pulse-700 hover:bg-pulse-600"
              onClick={startAssessment}
            >
              Start Assessment
            </Button>
          </div>
          <div className="text-sm text-pulse-300 text-center">
            <p>Don't have an API key?</p>
            <a
              href="https://elevenlabs.io/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pulse-100 hover:underline"
            >
              Sign up for ElevenLabs
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[80%] rounded-xl p-4 ${
                    message.isAi
                      ? "bg-pulse-700/50 text-pulse-100"
                      : "bg-pulse-600 text-pulse-100"
                  }`}
                >
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Microphone input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full ${
                  conversation.isSpeaking ? "bg-red-500/20 hover:bg-red-500/30" : ""
                }`}
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
            <p className="text-sm text-pulse-300 mt-2 text-center">
              {conversation.isSpeaking ? "Listening..." : "Click to speak"}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
