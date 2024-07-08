"use client";

import { Button } from "@/components/ui/button";
import { File } from "@prisma/client";
import { format } from "date-fns";
import { Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { deleteFile } from "../../_actions/file.actions";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PDFCard = ({ file }: { file: File }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useKindeBrowserClient();
  const handleClick = async () => {
    setIsLoading(true);
    await deleteFile({ fileId: file.id, userId: user!.id });
    window.location.reload();
  };
  return (
    <>
      <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
        <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-primary to-accent" />
          <div className="flex-1 truncate">
            <div className="flex items-center space-x-3">
              <h3 className="truncate text-lg font-medium text-secondary-foreground">
                {file.name}
              </h3>
            </div>
          </div>
        </div>
      </Link>
      <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-secondary-foreground">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {format(new Date(file.createdAt), "MMM yyyy")}
        </div>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          mock
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={isLoading}
              size={"sm"}
              className="w-full rounded-lg"
              variant={"destructive"}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-secondary text-primary-foreground">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will delete your file from
                our database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClick}
                className="text-destructive-foreground bg-destructive"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default PDFCard;
