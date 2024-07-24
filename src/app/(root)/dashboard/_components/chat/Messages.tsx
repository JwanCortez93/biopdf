import { getMessages } from "@/app/(root)/_actions/message.actions";
import { MessagesProps } from "../../../../../../types";
import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";

const Messages = async ({ fileId, userId }: MessagesProps) => {
  const response = await getMessages({ fileId, userId });

  if (!response) {
  }
  const { messages, nextCursor } = response!;

  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    isUserMessage: false,
    text: (
      <span className="flex-center h-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const combinedMessages = [...(true ? [loadingMessage] : []), ...messages];

  return (
    <div className="flex max-h-[100vh-3.5rem-7rem] border-secondary-foreground flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-primary-lighter scrollbar-w-2">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, index) => {
          const isNextMessageSamePerson =
            combinedMessages[index - 1]?.isUserMessage ===
            combinedMessages[index]?.isUserMessage;

          if (index === combinedMessages.length - 1) {
            return (
              <Message
                message={message}
                isNextMessageSamePerson={isNextMessageSamePerson}
                key={message.id}
              ></Message>
            );
          }
          return (
            <Message
              message={message}
              isNextMessageSamePerson={isNextMessageSamePerson}
              key={message.id}
            ></Message>
          );
        })
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-secondary-foreground text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
