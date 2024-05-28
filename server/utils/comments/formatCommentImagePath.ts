import { formatFilename } from "~/server/utils/files";

export const formatCommentImagePath = ({
  filename,
  commentId,
  mimeType,
}: {
  filename?: string;
  commentId: string;
  mimeType: string;
}): { path: string; filename: string; url: string } => {
  const runtimeConfig = useRuntimeConfig();

  const formattedFilename: string = formatFilename({
    filename,
    mimeType,
  });

  const path: string = `public/comments/${commentId}/illustrations/${formattedFilename}`;
  return {
    path,
    filename: formattedFilename,
    url: `${runtimeConfig.bucketEntryPoint}/${path}`,
  };
};
