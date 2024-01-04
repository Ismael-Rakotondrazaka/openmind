import { bucket } from "./bucket";

export const deleteFolder = (folderPath: string): Promise<void> =>
  bucket.deleteFiles({
    prefix: folderPath,
    force: true,
  });
