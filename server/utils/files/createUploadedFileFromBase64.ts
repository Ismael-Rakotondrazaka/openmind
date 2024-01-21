import { UploadedFile } from "./uploadedFiles";

export const createUploadedFileFromBase64 = ({
  base64,
  filename,
  mimeType,
}: {
  base64: string;
  filename: string;
  mimeType: string;
}): UploadedFile => {
  const decodedBuffer: Buffer = Buffer.from(base64, "base64");

  return new UploadedFile({
    blobParts: [decodedBuffer],
    name: filename,
    options: {
      type: mimeType,
    },
    buffer: decodedBuffer,
  });
};
