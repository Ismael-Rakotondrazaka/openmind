import xss from 'xss';

export function sanitize(dirty: string): string {
  return xss(dirty);
}
