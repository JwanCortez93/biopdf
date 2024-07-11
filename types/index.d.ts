import { ReactNode } from "react";

declare type MaxWidthWrapperProps = {
  className?: string;
  children: ReactNode;
};

declare type PDFRendererProps = {
  url: string;
};

declare type PDFFullscreenProps = {
  url: string;
};

declare type ChatWrapperProps = {
  fileId: string;
  userId: string;
};

declare type ChatInputProps = {
  isDisabled: boolean;
};

declare type ChatContextType = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

declare type ChatContextProviderProps = {
  fileId: string;
  children: ReactNode;
};
