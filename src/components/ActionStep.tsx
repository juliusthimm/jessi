
import { Check } from "lucide-react";

export const ActionStep = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="h-6 w-6 mt-1 rounded-full bg-pulse-700 flex items-center justify-center flex-shrink-0">
        <Check className="h-4 w-4 text-pulse-200" />
      </div>
      <div>
        <h4 className="font-medium text-pulse-100 mb-1">{title}</h4>
        <p className="text-sm text-pulse-300">{description}</p>
      </div>
    </div>
  );
};
