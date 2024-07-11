"use client";

import { createContext, useState } from "react";
import {
  ChatContextProviderProps,
  ChatContextType,
} from "../../../../../../types";
import { useToast } from "@/components/ui/use-toast";
import { sendMessage } from "@/app/(root)/_actions/message.actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export const ChatContext = createContext<ChatContextType>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

export const ChatContextProvider = ({
  fileId,
  children,
}: ChatContextProviderProps) => {
  const { user } = useKindeBrowserClient();
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = async () =>
    await sendMessage({ fileId, message, userId: user!.id });

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};
