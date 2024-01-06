import type { File } from "@google-cloud/storage";
import { bucket } from "./bucket";

export const deleteFilesInFolder = async ({
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
      .filter((file: File): boolean => {
        const publicUrl: string = file.publicUrl();

        try {
          return !excludes.includes(decodeURIComponent(publicUrl));
        } catch (error) {
          return !excludes.includes(publicUrl);
        }
      })
      .map((file: File) => file.delete()),
  ).then();
};
