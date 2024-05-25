import { type File as GCSFile } from "@google-cloud/storage";
import { bucket } from "./bucket";

export const saveFile = async ({
  file,
  destination,
  mimeType,
  isPublic,
  onFinish,
  onError,
}: {
  file: File;
  destination: string;
  mimeType: string;
  isPublic: boolean;
  onFinish?: () => void;
  // eslint-disable-next-line no-unused-vars
  onError?: (error: Error) => void;
}) => {
  const blob: GCSFile = bucket.file(destination);

  const blobStream = blob
    .createWriteStream({
      metadata: {
        contentType: mimeType,
      },
    })
    .on("error", (error: Error) => onError?.(error))
    .on("finish", async () => {
      try {
        if (isPublic) {
          await blob.makePublic();
        }

        return onFinish?.();
      } catch (error) {
        if (onError && error instanceof Error) {
          return onError(error);
        }
      }
    });

  const arrayBuffer: ArrayBuffer = await file.arrayBuffer();

  blobStream.end(Buffer.from(arrayBuffer));
};
