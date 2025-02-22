
import { useState } from "react";
import { Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatInterface = ({ onComplete }: { onComplete: () => void }) => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulate assessment completion
      setTimeout(onComplete, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4">AI Wellbeing Assessment</h2>
        <p className="text-pulse-300 max-w-md">
          Click the microphone to start your conversation with our AI assistant.
          They will guide you through a series of questions about your wellbeing.
        </p>
      </div>
      <Button
        variant="outline"
        size="lg"
        className={`rounded-full p-8 transition-all duration-300 ${
          isRecording ? "bg-red-500/20 hover:bg-red-500/30" : "hover:bg-pulse-700"
        }`}
        onClick={toggleRecording}
      >
        {isRecording ? (
          <StopCircle className="h-8 w-8 text-red-500" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </Button>
      {isRecording && (
        <p className="mt-4 text-red-400 animate-pulse">Recording...</p>
      )}
    </div>
  );
};
