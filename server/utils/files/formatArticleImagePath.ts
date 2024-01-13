import { formatFilename } from "./formatFileName";

export const formatArticleImagePath = ({
  filename,
  articleId,
  mimeType,
}: {
  filename?: string;
  articleId: string;
  mimeType: string;
}): { path: string; filename: string; url: string } => {
  const runtimeConfig = useRuntimeConfig();

  const formattedFilename: string = formatFilename({
    filename,
    mimeType,
  });

  const path: string = `public/articles/${articleId}/illustrations/${formattedFilename}`;
  return {
    path,
    filename: formattedFilename,
    url: `${runtimeConfig.bucketEntryPoint}/${path}`,
  };
};
