import { UploadedFile } from "~/server/utils/files";
import { formatUserProfilePath } from "~/server/utils/users/formatUserProfilePath";

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
