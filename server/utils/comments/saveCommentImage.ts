import { formatCommentImagePath } from "./formatCommentImagePath";
import { UploadedFile } from "~/server/utils/files";

export const saveCommentImage = ({
  file,
  commentId,
  excludes,
}: {
  file: UploadedFile;
  commentId: string;
  excludes?: string[];
}): string => {
  const { path, url } = formatCommentImagePath({
    filename: file.name,
    commentId,
    mimeType: file.type,
  });

  deleteFilesInFolder({
    folderPath: `public/comments/${commentId}/cover`,
    excludes,
  }).finally(() =>
    saveUploadedFile({
      file,
      isPublic: true,
      path,
    }),
  );

  return url;
};
