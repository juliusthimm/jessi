
import { MessageCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatHeaderProps = {
  isConfigured: boolean;
  onEndAssessment: () => void;
  onLogout: () => void;
};

export const ChatHeader = ({ isConfigured, onEndAssessment, onLogout }: ChatHeaderProps) => {
  return (
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
      </div>
    </div>
  );
};
