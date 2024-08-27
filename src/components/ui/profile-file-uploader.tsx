"use client";

import Image from "next/image";
import * as React from "react";
import Dropzone, { type DropzoneProps } from "react-dropzone";

import { Upload01Icon } from "hugeicons-react";
import { useControllableState } from "~/hooks/use-controllable-state";
import { cn } from "~/lib/utils";
import { type UploadedFile } from "~/types";
import { Icons } from "../shared/Icons";
import { Skeleton } from "./skeleton";
import { useToast } from "./use-toast";

interface ProfileFileUploaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: File;
  onValueChange?: React.Dispatch<React.SetStateAction<File>>;
  onUpload?: (file: File) => void;
  progresses: number;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  multiple?: boolean;
  uploadedFile?: UploadedFile<unknown> | { url: string; name: string };
  preparingUpload: boolean;
  imageLoad: boolean;
  setImageLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setPreparingUpload: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
}

export function ProfileFileUploader({
  uploadedFile,
  preparingUpload,
  imageLoad,
  setImageLoad,
  setPreparingUpload,
  ...props
}: ProfileFileUploaderProps) {
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
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      setFiles(file);

      if (onUpload && file) {
        setPreparingUpload(true);
        toast({
          title: "Preparing upload...",
        });

        onUpload(file);
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
              "overflow-hidden bg-white",
              !(!!uploadedFile && !!uploadedFile.url) &&
                "border-2 border-dashed border-slate-600 py-6",
              "group relative grid h-full w-full cursor-pointer place-items-center rounded-lg",
              "text-center transition hover:bg-secondary/5",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50 bg-primary/5",
              isDisabled && "pointer-events-none opacity-60",
              className,
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />

            {isDragActive ? (
              <DragSection />
            ) : (
              <>
                {preparingUpload ||
                (progresses > -1 && progresses <= 100) ||
                (uploadedFile && progresses > -1 && progresses <= 100) ? (
                  <Uploading />
                ) : (
                  <>
                    {uploadedFile?.url ? (
                      <FileUploaded
                        imageLoad={imageLoad}
                        setImageLoad={setImageLoad}
                        uploadedFile={uploadedFile}
                      />
                    ) : (
                      <NoFileUploaded />
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}

const NoFileUploaded = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="rounded-full border border-dashed border-muted-foreground p-3">
        <Upload01Icon
          className="size-7 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const Uploading = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="rounded-full border border-dashed border-muted-foreground p-2">
        <Icons.uploadingFile
          className="size-11 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

const FileUploaded = ({
  imageLoad,
  setImageLoad,
  uploadedFile,
}: {
  imageLoad: boolean;
  setImageLoad: React.Dispatch<React.SetStateAction<boolean>>;
  uploadedFile: UploadedFile<unknown> | { url: string; name: string };
}) => {
  return (
    <>
      <div
        className={cn(
          imageLoad ? "block" : "hidden",
          "absolute left-0 top-0 h-full w-full",
        )}
      >
        <Skeleton className="h-full min-h-[383px] w-full rounded-xl" />
      </div>
      <Image
        onLoadingComplete={() => setImageLoad(false)}
        src={uploadedFile.url}
        alt={uploadedFile.name}
        draggable={false}
        width={840}
        height={472}
        className={`${imageLoad ? "opacity-0" : "opacity-1"} absolute h-full w-full object-cover`}
      />
    </>
  );
};

const DragSection = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="rounded-full border border-dashed border-muted-foreground p-3">
        <Upload01Icon
          className="size-7 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}
