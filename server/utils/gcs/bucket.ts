import type { Bucket } from "@google-cloud/storage";
import { storage } from "./storage";

export const bucket: Bucket = (() => {
  const runtimeConfig = useRuntimeConfig();

  return storage.bucket(runtimeConfig.bucketName);
})();
