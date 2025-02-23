
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: number;
  lastUpdated?: string | null;
}

export const StatsCard = ({ icon: Icon, title, value, lastUpdated }: StatsCardProps) => {
  return (
    <Card className="p-6 bg-white/5 backdrop-blur-lg border-white/10">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-pulse-700/50">
          <Icon className="h-6 w-6 text-pulse-300" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-pulse-100">{title}</h2>
          <p className="text-3xl font-bold text-pulse-300">{value}</p>
          {lastUpdated && (
            <p className="text-sm text-pulse-400">Last updated {lastUpdated}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
