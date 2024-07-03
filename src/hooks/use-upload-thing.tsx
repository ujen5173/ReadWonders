import * as React from "react";
import type { UploadFilesOptions } from "uploadthing/types";
import { type OurFileRouter } from "~/app/api/uploadthing/core";

import { useToast } from "~/components/ui/use-toast";
import { type UploadedFile } from "~/types";
import { getErrorMessage } from "~/utils/handle-errors";
import { uploadFiles } from "~/utils/uploadthing";

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

  async function uploadThings(
    files: File,
    setPreparingUpload: React.Dispatch<React.SetStateAction<boolean>>,
    setImageUpload: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    setIsUploading(true);
    let dismissed = false;

    try {
      setUploadedFile(undefined);
      const res = await uploadFiles(endpoint, {
        ...props,
        files: [files],
        onUploadProgress: ({ progress }) => {
          setProgresses(progress);
          if (progress > 0 && !dismissed) {
            toast({
              title: `Uploading...`,
            });
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
    } catch (err) {
      setPreparingUpload(false);

      toast({
        title: getErrorMessage(err),
      });
    } finally {
      setProgresses(-1);
      setIsUploading(false);
    }
  }

  return {
    uploadedFile,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
  };
}
