"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { getRandom } from "@/lib/utils";
import { CloudUpload, File, Loader2 } from "lucide-react";
import { useState } from "react";

import Dropzone from "react-dropzone";
import { getFileByIdOrKey } from "../../_actions/file.actions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { redirect, useRouter } from "next/navigation";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(e) => {
        if (!e) {
          setIsOpen(e);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
};

const UploadDropzone = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { startUpload } = useUploadThing("pdfUploader");
  const { toast } = useToast();
  const { user } = useKindeBrowserClient();
  const router = useRouter();

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((state) => {
        if (state >= 95) {
          clearInterval(interval);
          return state;
        }
        return state + getRandom(2, 10);
      });
    }, getRandom(3, 10) * 100);
    return interval;
  };

  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        setIsUploading(true);
        const progressInterval = startSimulatedProgress();
        const res = await startUpload(acceptedFiles);
        if (!res) {
          return toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try again later",
          });
        }

        const [fileResponse] = res;
        const key = fileResponse.key;
        if (!key)
          return toast({
            variant: "destructive",
            title: "Something went wrong",
            description: "Please try again later",
          });

        clearInterval(progressInterval);
        setUploadProgress(100);
        const file = await getFileByIdOrKey({ userId: user!.id, key });
        console.log(file);

        router.push(`/dashboard/${file!.id}`);
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-muted rounded-lg"
        >
          <div className="flex-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-secondary hover:bg-neutral-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="h-6 w-6 mb-2 text-primary" />
                <p className="mb-2 text-sm text-primary-foreground">
                  <span className="font-semibold text-primary">
                    Click to upload
                  </span>{" "}
                  or drag your file here
                </p>
                <p className="text-sm text-muted">PDF (up to 4MB)</p>
              </div>
              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-accent flex items-center rounded-md overflow-hidden outline outline-[1px] outline-primary divide-x divide-primary">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <File className="h-4 w-4 text-white" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate text-white">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}
              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    value={uploadProgress}
                    className="h-1 w-full bg-white"
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex-center gap-1 text-sm text-primary font-semibold text-center pt-2">
                      <Loader2 className="animate-spin h-3 w-3" />
                      Redirecting...
                    </div>
                  ) : (
                    <p className="text-xs font-semibold text-muted mt-1 text-right">
                      Uploading... {uploadProgress}%
                    </p>
                  )}
                </div>
              ) : null}

              <input
                {...getInputProps}
                type="file"
                id="dropzone-file"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

export default UploadButton;
