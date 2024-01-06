import type { File } from "@google-cloud/storage";
import { bucket } from "./bucket";

export const deleteFolder = async ({
  folderPath,
  excludes = [],
}: {
  folderPath: string;
  excludes?: string[];
}): Promise<void> => {
  const [files] = await bucket.getFiles({
    prefix: folderPath,
  });

  return Promise.allSettled(
    files
      .filter((file: File) => !excludes.includes(file.publicUrl()))
      .map((file: File) => file.delete()),
  ).then();
};
