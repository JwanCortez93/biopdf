"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useForm } from "react-hook-form";

import { useResizeDetector } from "react-resize-detector";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SimpleBar from "simplebar-react";
import PDFFullscreen from "./PDFFullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFRenderer = ({ url }: PDFRendererProps) => {
  const { toast } = useToast();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const { width, ref } = useResizeDetector();

  const CustomPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(CustomPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  useEffect(() => {
    setValue("page", String(currPage));
  }, [currPage, setValue]);

  const handleLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const handleLoadError = useCallback(() => {
    toast({
      title: "Error loading PDF",
      description: "Please try again later",
      variant: "destructive",
    });
  }, [toast]);

  return (
    <div className="w-full bg-background rounded-md shadow flex flex-col items-center">
      <div className="h-14 w-full border-b border-secondary-foreground flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            size={"sm"}
            variant={"ghost"}
            aria-label="previous page"
            onClick={() => {
              setCurrPage((prev) => prev - 1);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              className={cn(
                "w-12 h-8 text-center",
                errors.page && "focus-visible:ring-destructive-foreground"
              )}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
            />
            <p className="text-muted-foreground text-sm space-x-1">
              <span>/</span>
              <span>{numPages ?? "x"}</span>
            </p>
          </div>
          <Button
            disabled={numPages === undefined || currPage >= numPages!}
            size={"sm"}
            variant={"ghost"}
            aria-label="next page"
            onClick={() => {
              setCurrPage((prev) => prev + 1);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"sm"}
                aria-label="zoom"
                variant={"ghost"}
                className="gap-1.5"
              >
                <Search className="h-4 w-4" />
                {zoom * 100}% <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => setZoom(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setZoom(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            variant="ghost"
            aria-label="rotate 90 degrees"
            onClick={() => setRotation((prev) => prev + 90)}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <PDFFullscreen url={url} />
        </div>
      </div>
      <div className="flex-1 w-full max-h-[calc(100vh-3.5rem)]">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              file={url}
              className="max-h-full"
            >
              <Page
                scale={zoom}
                rotate={rotation}
                pageNumber={currPage}
                width={width ? width : 1}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6 animate-spin" />
                  </div>
                }
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
};

export default PDFRenderer;
