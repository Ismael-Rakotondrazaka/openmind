import mime from 'mime';
import { nanoid } from 'nanoid';
import { basename, extname } from 'path';

import { sanitize } from '../sanitizer/sanitizer';
import { slugify } from '../slugifier/slugifier';

export function generateStorageKey(
  fileName: string,
  contentType: string
): string {
  const ext = getExtensionFromMimeType(contentType);
  const base = basename(fileName, extname(fileName));
  const slug = slugify(sanitize(base));
  const id = nanoid(10);
  return ext ? `${slug}--${id}.${ext}` : `${slug}--${id}`;
}

export function getExtensionFromMimeType(mimeType: string): null | string {
  if (mimeType !== 'application/octet-stream') {
    return mime.getExtension(mimeType);
  }

  return null;
}
