
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  source: string;
  message: string;
};

export const CallTranscript = ({ messages }: { messages: Message[] }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            className={`flex ${message.source === 'ai' ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl p-4 ${
                message.source === 'ai'
                  ? "bg-pulse-700/50 text-pulse-100"
                  : "bg-pulse-600 text-pulse-100"
              }`}
            >
              <p>{message.message}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
