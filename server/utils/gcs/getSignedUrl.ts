import type {
  File,
  GetSignedUrlConfig,
  GetSignedUrlResponse,
} from "@google-cloud/storage";
import { bucket } from "./bucket";

const getSignedUrl = async ({
  path,
  options,
}: {
  path: string;
  options: GetSignedUrlConfig;
}): Promise<string> => {
  const signedUrlOptions: GetSignedUrlConfig = {
    ...options,
    version: "v4",
  };

  const blob: File = bucket.file(path);

  const urls: GetSignedUrlResponse = await blob.getSignedUrl(signedUrlOptions);

  return urls[0];
};

export { getSignedUrl };
