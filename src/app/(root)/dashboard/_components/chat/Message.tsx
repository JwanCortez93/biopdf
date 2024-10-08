import { cn } from "@/lib/utils";
import { MessageProps } from "../../../../../../types";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

const Message = ({ message, isNextMessageSamePerson }: MessageProps) => {
  return (
    <div
      className={cn("flex items-end", { "justify-end": message.isUserMessage })}
    >
      <div
        className={cn("relative flex-center h-6 w-6 aspect-square", {
          "order-2 bg-secondary rounded-sm": message.isUserMessage,
          "order-1 bg-primary rounded-sm": !message.isUserMessage,
          invisible: isNextMessageSamePerson,
        })}
      >
        {message.isUserMessage ? (
          <User className="fill-secondary text-secondary-foreground h-3/4 w-3/4" />
        ) : (
          <Bot className="fill-primary text-primary-foreground h-3/4 w-3/4" />
        )}
      </div>
      <div
        className={cn("flex flex-col space-y-2 text-base max-w-md mx-2", {
          "order-1 items-end": message.isUserMessage,
          "order-2 items-start": !message.isUserMessage,
        })}
      >
        <div
          className={cn("px-4 py-2 rounded-lg inline-block", {
            "bg-secondary text-secondary-foreground": message.isUserMessage,
            "bg-primary text-primary-foreground": !message.isUserMessage,
            "rounded-br-none":
              !isNextMessageSamePerson && message.isUserMessage,
            "rounded-bl-none":
              !isNextMessageSamePerson && !message.isUserMessage,
          })}
        >
          {typeof message.text === "string" ? (
            <ReactMarkdown
              className={cn("prose", {
                "text-secondary-foreground": message.isUserMessage,
              })}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            message.text
          )}
          {message.id !== "loading-message" ? (
            <div
              className={cn("text-xs select-none mt-2 w-full text-right", {
                "text-secondary-foreground": message.isUserMessage,
                "text-primary-foreground": !message.isUserMessage,
              })}
            >
              {format(new Date(message.createdAt), "HH:mm")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;
