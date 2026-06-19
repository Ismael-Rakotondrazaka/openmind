export interface UploadPostFileResult {
  path: string;
  publicUrl: string;
}

export const useUploadPostFile = () => {
  const upload = async (
    _userId: string,
    file: File
  ): Promise<UploadPostFileResult> => {
    const { path, publicUrl, uploadUrl } = await $fetch<{
      path: string;
      publicUrl: string;
      uploadUrl: string;
    }>('/api/storage/posts/files/presign', {
      body: { contentType: file.type, fileName: file.name },
      method: 'POST',
    });

    await fetch(uploadUrl, {
      body: file,
      headers: { 'Content-Type': file.type },
      method: 'PUT',
    });

    return { path, publicUrl };
  };

  return upload;
};
