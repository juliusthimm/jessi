
import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  id: number;
  text: string;
  isAi: boolean;
};

export const ChatInterface = ({ onComplete }: { onComplete: () => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulated conversation flow
  const conversationSteps = [
    "Hi! I'm here to help assess your wellbeing. How are you feeling today?",
    "Let's talk about your work conditions. Is your current workload manageable?",
    "How would you describe the atmosphere at your workplace?",
    "That's helpful to know. Now, regarding your motivation - do you find your work challenging enough?",
    "Thank you for sharing. Based on our conversation, I'll now prepare your wellbeing report."
  ];

  useEffect(() => {
    // Add initial AI message
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          { id: 1, text: conversationSteps[0], isAi: true }
        ]);
      }, 1000);
    }
  }, []);

  const simulateResponse = () => {
    const nextStep = currentStep + 1;
    if (nextStep < conversationSteps.length) {
      setCurrentStep(nextStep);
      setMessages(prev => [
        ...prev,
        // Simulate user response
        { 
          id: prev.length + 1, 
          text: "...", // In a real app, this would be actual user input
          isAi: false 
        },
        // AI response
        { 
          id: prev.length + 2, 
          text: conversationSteps[nextStep],
          isAi: true 
        }
      ]);
    } else {
      // End the conversation
      setTimeout(onComplete, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      {/* Chat header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-pulse-700 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-pulse-300" />
          </div>
          <div>
            <h3 className="font-semibold">Wellbeing Assistant</h3>
            <p className="text-sm text-pulse-300">AI-powered assessment</p>
          </div>
        </div>
      </div>

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

      {/* Chat input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Button
            className="w-full bg-pulse-700 hover:bg-pulse-600"
            onClick={simulateResponse}
          >
            Continue Conversation
          </Button>
        </div>
        <p className="text-sm text-pulse-300 mt-2 text-center">
          Click to progress through the conversation
        </p>
      </div>
    </div>
  );
};
