import _slugify from 'slugify';

export function slugify(raw: string): string {
  return _slugify(raw, { lower: true });
}
