import { bucket } from "./bucket";

export const uploadFileFromBase64 = ({
  path,
  base64,
  isPublic,
  mimeType,
}: {
  path: string;
  base64: string;
  isPublic: boolean;
  mimeType: string;
}) => {
  const file = bucket.file(path);

  const buffer = Buffer.from(base64, "base64");

  const stream = file.createWriteStream({
    metadata: {
      contentType: mimeType,
    },
    public: isPublic,
  });

  return new Promise<void>((resolve, reject) => {
    stream.on("error", (error) => {
      reject(error);
    });

    stream.on("finish", () => {
      resolve();
    });

    stream.end(buffer);
  });
};
