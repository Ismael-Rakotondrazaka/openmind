import { nanoid } from 'nanoid';
import slugify from 'slugify';

import { POST_FILES_BUCKET } from '~/features/shared/posts/post.config';

export interface UploadPostFileResult {
  path: string;
  publicUrl: string;
}

export const useUploadPostFile = () => {
  const upload = async (
    userId: string,
    file: File
  ): Promise<UploadPostFileResult> => {
    const client = useSupabaseClient();
    const lastDot = file.name.lastIndexOf('.');
    const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
    const ext = lastDot > 0 ? file.name.slice(lastDot) : '';
    const sanitizedName = slugify(baseName, { lower: true, strict: true });
    const uniqueId = nanoid();
    const uniqueName = `openmind__${sanitizedName}__${uniqueId}${ext}`;
    const path = `${userId}/${uniqueName}`;

    const { error } = await client.storage
      .from(POST_FILES_BUCKET)
      .upload(path, file, { upsert: false });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = client.storage.from(POST_FILES_BUCKET).getPublicUrl(path);

    return { path, publicUrl };
  };

  return upload;
};
