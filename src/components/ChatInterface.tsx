
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CallTranscript } from "./CallTranscript";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatControls } from "./chat/ChatControls";
import { ChatLoading } from "./chat/ChatLoading";

type Message = {
  source: string;
  message: string;
};

export const ChatInterface = ({ onComplete }: { onComplete: () => void }) => {
  const [isConfigured, setIsConfigured] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [apiKeyData, setApiKeyData] = useState<string | null>(null);
  const [isCallFinished, setIsCallFinished] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const conversation = useConversation({
    onConnect: () => {
      toast({
        title: "Connected",
        description: "Ready to start the conversation",
      });
    },
    onMessage: (message) => {
      setMessages(prev => [...prev, {
        source: message.source,
        message: message.message
      }]);
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
    onDisconnect: () => {
      toast({
        title: "Disconnected",
        description: 'Your conversation has ended.',
      });
      setIsCallActive(false);
      setIsCallFinished(true);
    }
  });

  useEffect(() => {
    const configureElevenLabs = async () => {
      try {
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .functions.invoke('get-elevenlabs-key');
    
        if (apiKeyError || !apiKeyData?.apiKey) {
          console.error("ElevenLabs API key error:", apiKeyError);
          toast({
            title: "Error",
            description: "Could not retrieve ElevenLabs API key",
            variant: "destructive",
          });
          return;
        } 
        setIsConfigured(true);
        setApiKeyData(apiKeyData.apiKey);
      } catch (error) {
        console.error("Configuration error:", error);
        toast({
          title: "Error",
          description: "Failed to configure chat",
          variant: "destructive",
        });
      }
    }

    configureElevenLabs();
  }, [toast]);

  const startConversation = async () => {
    try {
      if (!apiKeyData) {
        throw new Error("ElevenLabs API key not available");
      }

      const conversationId = await conversation.startSession({
        apiKey: apiKeyData,
        agentId: "AOtHugEpQt093WLjDkRY",
      });
      setConversationId(conversationId);
      setIsConfigured(true);
      setMessages([]);
    } catch (error) {
      console.error("Start conversation error:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to ElevenLabs",
        variant: "destructive",
      });
      setIsCallActive(false);
    }
  };

  const handleStartCall = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await startConversation();
      setIsCallActive(true);
      toast({
        title: "Call Started",
        description: "You can now speak with the AI assistant",
      });
    } catch (error) {
      console.error("Start call error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Could not access microphone",
        variant: "destructive",
      });
      setIsCallActive(false);
    }
  };

  const handleEndCall = async () => {
    try {
      await conversation.endSession();
      setIsCallActive(false);
      setIsCallFinished(true);
    } catch (error) {
      console.error("End call error:", error);
      toast({
        title: "Error",
        description: "Could not end call",
        variant: "destructive",
      });
    }
  };

  const handleEndAssessment = async () => {
    try {
      await conversation.endSession();
      if (conversationId) {
        navigate(`/analysis/${conversationId}`);
      }
      onComplete();
    } catch (error) {
      console.error("End assessment error:", error);
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
      <ChatHeader 
        isConfigured={isConfigured}
        onEndAssessment={handleEndAssessment}
        onLogout={handleLogout}
      />

      {!isConfigured ? (
        <ChatLoading />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto">
            <CallTranscript messages={messages} />
            <div ref={messagesEndRef} />
          </div>

          <ChatControls 
            isCallActive={isCallActive}
            onStartCall={handleStartCall}
            onEndCall={handleEndCall}
            isCallFinished={isCallFinished}
            handleEndAssessment={handleEndAssessment}
          />
        </>
      )}
    </div>
  );
};
