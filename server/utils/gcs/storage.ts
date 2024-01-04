import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";

export const storage: Storage = new Storage(
  (() => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const runtimeConfig = useRuntimeConfig();

    return {
      projectId: runtimeConfig.bucketName,
      keyFilename: resolve(__dirname, "../../", "GCSServiceAccount.json"),
    };
  })(),
);
