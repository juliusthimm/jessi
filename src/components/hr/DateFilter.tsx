
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface DateFilterProps {
  dateFilter: Date | null;
  setDateFilter: (date: Date | null) => void;
}

export const DateFilter = ({ dateFilter, setDateFilter }: DateFilterProps) => {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-pulse-700/50 border-white/10 text-pulse-100 hover:bg-pulse-600"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? format(dateFilter, "PPP") : "Filter by date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-pulse-700 border-white/10">
          <Calendar
            mode="single"
            selected={dateFilter || undefined}
            onSelect={setDateFilter}
            initialFocus
            className="bg-pulse-700 text-pulse-100"
          />
        </PopoverContent>
      </Popover>
      {dateFilter && (
        <Button
          variant="outline"
          className="bg-pulse-700/50 border-white/10 text-pulse-100 hover:bg-pulse-600"
          onClick={() => setDateFilter(null)}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
};
