import { fileTypeFromBuffer, type FileTypeResult } from "file-type";
import { z } from "zod";
import { FileSchema } from "~/utils";
import { UploadedFile } from "~/server/utils/files";

export const makeSafeFileSchema = (maxSize: number, mimeTypes: string[]) =>
  FileSchema.transform(async (val: File, ctx): Promise<UploadedFile> => {
    const arrayBuffer: ArrayBuffer = await val.arrayBuffer();

    const fileTypeResult: FileTypeResult | undefined =
      await fileTypeFromBuffer(arrayBuffer);

    if (fileTypeResult === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File not supported. Expected formats: ${mimeTypes
          .map((val: string) => `"${val}"`)
          .join(", ")}.`,
        fatal: true,
      });

      return z.NEVER;
    }

    if (!mimeTypes.includes(fileTypeResult.mime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `File not supported. Expected formats: ${mimeTypes
          .map((val: string) => `"${val}"`)
          .join(", ")}.`,
        fatal: true,
      });

      return z.NEVER;
    }

    if (val.size > maxSize) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `The file size should not exceed ${
          Math.floor(maxSize) / 1000000
        }Mo.`,
        fatal: true,
      });

      return z.NEVER;
    }

    return new UploadedFile({
      blobParts: [val],
      name: formatFilename({
        filename: val.name,
        mimeType: fileTypeResult.mime,
      }),
      options: {
        type: fileTypeResult.mime,
        lastModified: val.lastModified,
      },
      buffer: Buffer.from(arrayBuffer),
    });
  });
