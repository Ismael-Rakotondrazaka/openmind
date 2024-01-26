import { UploadedFile, formatUserProfilePath } from "~/server/utils/files";

export const saveUserProfile = ({
  file,
  userId,
}: {
  file: UploadedFile;
  userId: number;
}): string => {
  const { path, url } = formatUserProfilePath({
    filename: file.name,
    userId,
    mimeType: file.type,
  });

  deleteFilesInFolder({
    folderPath: `public/users/${userId}/profile`,
  }).finally(() =>
    saveUploadedFile({
      file,
      isPublic: true,
      path,
    }),
  );

  return url;
};
