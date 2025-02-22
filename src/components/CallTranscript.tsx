
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  text: string;
  isAi: boolean;
};

export const CallTranscript = ({ messages }: { messages: Message[] }) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
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
    </ScrollArea>
  );
};
