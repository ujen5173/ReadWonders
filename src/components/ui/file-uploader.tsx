"use client";

import Image from "next/image";
import * as React from "react";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";

import { UploadIcon, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { useControllableState } from "~/hooks/use-controllable-state";
import { type UploadedFile } from "~/types";
import { cn } from "~/utils/cn";
import { formatBytes } from "~/utils/formatBytes";
import { Icons } from "../Icons";
import { Skeleton } from "./skeleton";
import { useToast } from "./use-toast";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File;
  onValueChange?: React.Dispatch<React.SetStateAction<File>>;
  onUpload?: (files: File) => Promise<void>;
  progresses: number | -1;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  multiple?: boolean;
  uploadedFile: UploadedFile<unknown> | undefined;
  preparingUpload: boolean;
  imageLoad: boolean;
  setImageLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setPreparingUpload: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const { toast } = useToast();

  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 2,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setFiles(undefined);

      if (!multiple && acceptedFiles.length > 1) {
        toast({
          title: "Cannot upload more than 1 file at a time",
        });

        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      setFiles(newFiles[0]);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast({
            title: `File ${file.name} was rejected`,
          });
        });
      }

      if (onUpload && newFiles[0]) {
        props.setPreparingUpload(true);
        toast({
          title: "Preparing upload...",
        });

        onUpload(newFiles[0]);
      }
    },

    [files, multiple, onUpload, setFiles],
  );

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!files) return;
      if (isFileWithPreview(files)) {
        URL.revokeObjectURL(files.preview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled;

  return (
    <div className="relative flex h-full flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={1}
        multiple={false}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "overflow-hidden",
              !(!!props.uploadedFile && !!props.uploadedFile.url) &&
                "border-2 border-dashed border-muted-foreground/20",
              "group relative grid h-full w-full cursor-pointer place-items-center rounded-lg",
              "text-center transition hover:bg-primary/5",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50 bg-primary/5",
              isDisabled && "pointer-events-none opacity-60",
              className,
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {!!props.uploadedFile && !!props.uploadedFile.url ? (
              <>
                <div className={cn(props.imageLoad ? "block" : "hidden")}>
                  <Skeleton className="h-[383px] w-[320px] rounded-xl" />
                </div>

                <Image
                  onLoadingComplete={() => props.setImageLoad((prev) => !prev)}
                  src={props.uploadedFile.url}
                  alt={props.uploadedFile.name}
                  width={840}
                  height={472}
                  className={`${props.imageLoad ? "opacity-0" : "opacity-1"} absolute h-full w-full object-cover`}
                />
              </>
            ) : (
              <div className="px-5 py-2.5">
                {isDragActive ? (
                  <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                    <div className="rounded-full border border-dashed border-muted-foreground p-3">
                      <UploadIcon
                        className="size-7 text-muted-foreground"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="font-medium text-muted-foreground">
                      Drop the files here
                    </p>
                  </div>
                ) : (
                  <>
                    {progresses === -1 && !props.preparingUpload ? (
                      <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                        <div className="rounded-full border border-dashed border-muted-foreground p-3">
                          <UploadIcon
                            className="size-7 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="space-y-px">
                          <p className="font-medium text-muted-foreground">
                            Drag & drop file here, or click to select file
                          </p>
                          <p className="text-sm text-muted-foreground/70">
                            You can upload files (up to {formatBytes(maxSize)})
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center justify-center gap-4 sm:px-5">
                        <div className="rounded-full border border-dashed border-muted-foreground p-3">
                          <Icons.uploadingFile
                            className="size-11 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="w-full space-y-px">
                          <p className="mb-2 font-medium text-muted-foreground">
                            {props.preparingUpload
                              ? "Preparing upload"
                              : "Uploading"}
                            ...
                          </p>
                          <Progress value={progresses} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            width={48}
            height={48}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        ) : null}
        <div className="flex w-full flex-col gap-2">
          <div className="space-y-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
        >
          <X className="size-4 " aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}
