import { nanoid } from 'nanoid';
import slugify from 'slugify';

const PROFILE_IMAGES_BUCKET = 'profile-images';

export const useUploadUserAvatar = () => {
  const upload = async (userId: string, file: File): Promise<string> => {
    const client = useSupabaseClient();
    const lastDot = file.name.lastIndexOf('.');
    const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
    const ext = lastDot > 0 ? file.name.slice(lastDot) : '';
    const sanitizedName = slugify(baseName, { lower: true, strict: true });
    const uniqueId = nanoid();
    const uniqueName = `openmind__${sanitizedName}__${uniqueId}${ext}`;
    const path = `${userId}/${uniqueName}`;

    const { error } = await client.storage
      .from(PROFILE_IMAGES_BUCKET)
      .upload(path, file, { upsert: false });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = client.storage.from(PROFILE_IMAGES_BUCKET).getPublicUrl(path);

    return publicUrl;
  };

  return upload;
};
