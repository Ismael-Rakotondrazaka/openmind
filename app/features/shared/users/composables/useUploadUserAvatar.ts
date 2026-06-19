export const useUploadUserAvatar = () => {
  const upload = async (userId: string, file: File): Promise<string> => {
    const { publicUrl, uploadUrl } = await $fetch<{
      publicUrl: string;
      uploadUrl: string;
    }>(
      `/api/storage/users/${userId}/avatar/presign` as '/api/storage/users/${string}/avatar/presign',
      {
        body: { contentType: file.type, fileName: file.name },
        method: 'POST',
      }
    );

    await fetch(uploadUrl, {
      body: file,
      headers: { 'Content-Type': file.type },
      method: 'PUT',
    });

    return publicUrl;
  };

  return upload;
};
