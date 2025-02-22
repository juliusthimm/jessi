
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatControlsProps = {
  isCallActive: boolean;
  onStartCall: () => Promise<void>;
  onEndCall: () => Promise<void>;
  isCallFinished: boolean;
  handleEndAssessment: () => Promise<void>;
};

export const ChatControls = ({ isCallActive, onStartCall, onEndCall, isCallFinished, handleEndAssessment }: ChatControlsProps) => {
  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex justify-center items-center gap-4">
        {isCallFinished ? 
        <Button variant="ghost" onClick={handleEndAssessment}>Check out assessment</Button> : 

        <Button
        size="icon"
        onClick={isCallActive ? onEndCall : onStartCall}
        className={`h-12 w-12 rounded-full ${
          isCallActive ? "bg-red-500/20 hover:bg-red-500/30" : ""
        }`}
      >
        <Mic className={`h-6 w-6 ${isCallActive ? "text-red-500" : ""}`} />
      </Button>
      }

      </div>
      <p className="text-sm text-pulse-300 mt-2 text-center">
        {isCallFinished ? "" : isCallActive ? "Listening..." : "Click to start call"}
      </p>
    </div>
  );
};
