import { UploadedFile } from "~/server/utils/files";

export const uploadArticleCover = ({
  file,
  articleId,
}: {
  file: UploadedFile;
  articleId: string;
}): string => {
  const { path, url } = formatArticleCoverPath({
    filename: file.name,
    articleId,
    mimeType: file.type,
  });

  deleteFilesInFolder({
    folderPath: `public/articles/${articleId}/cover`,
  }).finally(() =>
    saveUploadedFile({
      file,
      isPublic: true,
      path,
    }),
  );

  return url;
};
