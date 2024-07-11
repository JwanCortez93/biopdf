import { getFileUploadStatus } from "@/app/(root)/_actions/file.actions";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { Loader2, XCircle } from "lucide-react";
import Link from "next/link";

const ChatWrapper = async ({ fileId, userId }: ChatWrapperProps) => {
  const { status } = await getFileUploadStatus({ fileId, userId });

  return (
    <div className="relative min-h-full bg-zinc-300 flex flex-col justify-between gap-2 divide-y divide-secondary-foreground">
      <div className="flex-1 justify-between flex flex-col mb-28">
        {status === "PENDING" ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-muted text-sm">We&apos;re preparing your PDF.</p>
          </div>
        ) : status === "PROCESSING" ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <h3 className="font-semibold text-xl ">Processing...</h3>
            <p className="text-muted text-sm">Your PDF is coming to life.</p>
          </div>
        ) : status === "FAILED" ? (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="h-8 w-8 text-destructive-foreground" />
            <h3 className="font-semibold text-xl ">Too many pages in PDF.</h3>
            <p className="text-muted text-sm">
              <Link href={"/pricing"}>
                <span className="text-primary font-semibold">
                  Upgrade your plan
                </span>{" "}
                to chat with it.
              </Link>
            </p>
          </div>
        ) : (
          <Messages />
        )}
      </div>
      <ChatInput isDisabled={status !== "SUCCESS"} />
    </div>
  );
};

export default ChatWrapper;
