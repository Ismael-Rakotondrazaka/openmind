import type { UploadedFile } from "~/server/utils/files";
import { bucket } from "./bucket";

export const saveUploadedFile = ({
  path,
  file,
  isPublic,
}: {
  path: string;
  file: UploadedFile;
  isPublic: boolean;
}): Promise<void> => {
  const bucketFile = bucket.file(path);

  const buffer: Buffer = file.buffer;

  return bucketFile.save(buffer, {
    metadata: {
      contentType: file.type,
    },
    public: isPublic,
  });
};
