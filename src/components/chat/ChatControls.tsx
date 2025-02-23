
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
        <Button variant="ghost" onClick={handleEndAssessment} className="hover:bg-pulse-700">Check out assessment</Button> : 

        <Button
          size="icon"
          onClick={isCallActive ? onEndCall : onStartCall}
          className={`h-12 w-12 rounded-full ${
            isCallActive ? "bg-red-500 hover:bg-red-600" : "bg-pulse-600 hover:bg-pulse-500"
          }`}
        >
          <Mic className={`h-6 w-6 ${isCallActive ? "text-white" : ""}`} />
        </Button>
        }

      </div>
      <p className="text-sm text-pulse-300 mt-2 text-center">
        {isCallFinished ? "" : isCallActive ? "Listening..." : "Click to start call"}
      </p>
    </div>
  );
};
