import { JSDOM } from "jsdom";
import mime from "mime";
import { articleImageConfig } from "~/utils";

export const formatArticleContent = (
  content: string,
  userId: number,
): {
  content: string;
  filesToUpload: {
    path: string;
    base64: string;
    isPublic: boolean;
    mimeType: string;
  }[];
} => {
  const dom = new JSDOM(sanitize(content));

  const imageElements = dom.window.document.querySelectorAll("img");

  const imagesToUpload: {
    path: string;
    base64: string;
    isPublic: boolean;
    mimeType: string;
  }[] = [];

  imageElements.forEach((imageElement) => {
    const src: string | null = imageElement.getAttribute("src");

    if (src === null) {
      return;
    }

    // Define a regular expression to capture the content type and base64 data
    const regex = /^data:([^;]+);base64,(.+)$/;

    const matches = src.match(regex);

    if (matches === null) {
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

    const { path, url } = formatArticleImagePath({
      mimeType,
      userId,
    });

    imagesToUpload.push({
      path,
      base64: data,
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
    filesToUpload: imagesToUpload,
  };
};
