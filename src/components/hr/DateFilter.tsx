
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { subDays, subMonths, subWeeks, subYears } from "date-fns";

interface DateFilterProps {
  dateRange: { start: Date; end: Date } | null;
  setDateRange: (range: { start: Date; end: Date } | null) => void;
}

const DATE_RANGES = {
  "all": { label: "All time", getFn: () => null },
  "1w": { label: "Last Week", getFn: () => subWeeks(new Date(), 1) },
  "2w": { label: "Last 2 Weeks", getFn: () => subWeeks(new Date(), 2) },
  "1m": { label: "Last Month", getFn: () => subMonths(new Date(), 1) },
  "3m": { label: "Last 3 Months", getFn: () => subMonths(new Date(), 3) },
  "6m": { label: "Last 6 Months", getFn: () => subMonths(new Date(), 6) },
  "1y": { label: "Last Year", getFn: () => subYears(new Date(), 1) },
} as const;

export const DateFilter = ({ dateRange, setDateRange }: DateFilterProps) => {
  const handleRangeChange = (value: string) => {
    if (value === 'all') {
      setDateRange(null);
      return;
    }
    const now = new Date();
    const startDate = DATE_RANGES[value as keyof typeof DATE_RANGES].getFn();
    if (startDate) {
      setDateRange({ start: startDate, end: now });
    }
  };

  return (
    <div className="flex gap-2">
      <Select onValueChange={handleRangeChange} defaultValue="all">
        <SelectTrigger className="w-[180px] bg-pulse-700/50 border-white/10 text-pulse-100">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Filter by date range" />
        </SelectTrigger>
        <SelectContent className="bg-pulse-700 border-white/10">
          {Object.entries(DATE_RANGES).map(([key, { label }]) => (
            <SelectItem 
              key={key} 
              value={key}
              className="text-pulse-100 focus:bg-pulse-600 focus:text-pulse-100"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
