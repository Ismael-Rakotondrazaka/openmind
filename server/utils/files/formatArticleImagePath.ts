import { formatFilename } from "./formatFileName";

export const formatArticleImagePath = ({
  filename,
  userId,
  mimeType,
}: {
  filename?: string;
  userId: number;
  mimeType: string;
}): { path: string; filename: string; url: string } => {
  const runtimeConfig = useRuntimeConfig();

  const formattedFilename: string = formatFilename({
    filename,
    mimeType,
  });

  const path: string = `public/users/${userId}/articles/${formattedFilename}`;
  return {
    path,
    filename: formattedFilename,
    url: `${runtimeConfig.bucketEntryPoint}/${path}`,
  };
};
