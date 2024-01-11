import { formatFilename } from "~/server/utils/files";

export const formatArticleCoverPath = ({
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

  const path: string = `public/articles/${articleId}/cover/${formattedFilename}`;

  return {
    path,
    filename: formattedFilename,
    url: `${runtimeConfig.bucketEntryPoint}/${path}`,
  };
};
