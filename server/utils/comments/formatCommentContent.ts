import { JSDOM } from "jsdom";
import mime from "mime";
import {
  UploadedFile,
  createUploadedFileFromBase64,
} from "~/server/utils/files";
import { articleImageConfig } from "~/utils";
import { formatCommentImagePath } from "~/server/utils/comments";

export const formatCommentContent = (
  content: string,
  commentId: string,
): {
  content: string;
  filesToSave: {
    path: string;
    file: UploadedFile;
    isPublic: boolean;
    mimeType: string;
  }[];
  fileUrlsToExclude: string[];
} => {
  const dom = new JSDOM(sanitize(content));

  const imageElements = dom.window.document.querySelectorAll("img");

  const imagesToUpload: {
    path: string;
    file: UploadedFile;
    isPublic: boolean;
    mimeType: string;
  }[] = [];

  const fileUrlsToExclude: string[] = [];

  imageElements.forEach((imageElement) => {
    const src: string | null = imageElement.getAttribute("src");

    if (src === null) {
      return;
    }

    // Define a regular expression to capture the content type and base64 data
    const regex = /^data:([^;]+);base64,(.+)$/;

    const matches = src.match(regex);

    if (matches === null) {
      try {
        fileUrlsToExclude.push(decodeURIComponent(src));
      } catch (error) {
        fileUrlsToExclude.push(src);
      }
      return;
    }

    const mimeType: string = matches[1];
    const extension: string | null = mime.getExtension(mimeType);

    const data: string = matches[2];

    if (extension === null) {
      return;
    }

    if (!articleImageConfig.MIME_TYPES.includes(mimeType)) {
      return;
    }

    const { path, url, filename } = formatCommentImagePath({
      mimeType,
      commentId,
    });

    imagesToUpload.push({
      path,
      file: createUploadedFileFromBase64({
        base64: data,
        filename,
        mimeType,
      }),
      isPublic: true,
      mimeType,
    });

    imageElement.setAttribute("src", url);
  });

  const serialized = dom.serialize();

  const bodyRegex = /<body>([\s\S]*?)<\/body>/i;
  const match = bodyRegex.exec(serialized);

  let finalContent: string = "";

  if (match !== null) {
    finalContent = sanitize(match[1]);
  }

  return {
    content: finalContent,
    filesToSave: imagesToUpload,
    fileUrlsToExclude,
  };
};
