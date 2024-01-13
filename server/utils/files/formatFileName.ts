import mime from "mime";
import { extractNamePart } from "./extractNamePart";
import { fileConfig } from "~/utils";
import { slugify } from "~/server/utils/strings";

export const formatFilename = ({
  filename,
  mimeType,
}: {
  filename: string | undefined;
  mimeType: string | undefined;
}): string => {
  let formattedFilename: string = "";

  // to make sure the filename is unique
  const suffix: string = createRandomString(fileConfig.SUFFIX_LENGTH);

  if (filename !== undefined) {
    const filenamePart = extractNamePart(filename);

    formattedFilename = `${slugify(filenamePart).slice(
      0,
      fileConfig.NAME_MAX_LENGTH,
    )}-${suffix}`;
  } else {
    formattedFilename = `-${suffix}`;
  }

  if (mimeType !== undefined && mimeType !== "application/octet-stream") {
    const possibleExtension: string | null = mime.getExtension(mimeType);

    if (possibleExtension !== null) {
      formattedFilename += `.${possibleExtension}`;
    }
  }

  return formattedFilename;
};
