import * as React from "react";
import type { UploadFilesOptions } from "uploadthing/types";
import { type OurFileRouter } from "~/app/api/uploadthing/core";
import { useToast } from "~/components/ui/use-toast";
import { getErrorMessage } from "~/lib/handle-errors";
import { uploadFiles } from "~/lib/uploadthing";
import { type UploadedFile } from "~/types";

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFile?: UploadedFile;
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFile, ...props }: UseUploadFileProps = {},
) {
  const [uploadedFile, setUploadedFile] = React.useState<
    UploadedFile | undefined
  >(defaultUploadedFile);
  const [progresses, setProgresses] = React.useState<number>(-1);
  const [isUploading, setIsUploading] = React.useState(false);
  const { toast } = useToast();

  const uploadThings = async (
    file: File,
    setPreparingUpload: React.Dispatch<React.SetStateAction<boolean>>,
    setImageUpload: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setIsUploading(true);
    let dismissed = false;

    try {
      setUploadedFile(undefined);
      const res = await uploadFiles(endpoint, {
        ...props,
        files: [file],
        onUploadProgress: ({ progress }) => {
          setProgresses(progress);
          if (progress > 0 && !dismissed) {
            toast({ title: "Uploading..." });
            setPreparingUpload(false);
            dismissed = true;
          }
        },
        onUploadBegin: () => {
          setProgresses(0);
        },
      });

      setImageUpload(true);
      setUploadedFile(res[0]);
      toast({ title: "Upload successful!" });
    } catch (err) {
      setPreparingUpload(false);
      toast({ title: getErrorMessage(err) });
    } finally {
      setProgresses(-1);
      setIsUploading(false);
    }
  };

  return {
    uploadedFile,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
  };
}
