export function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

export function formatTimestamptz(iso: string): string {
  return iso.replace('T', ' ').replace('Z', '+00');
}

export function quoteLiteral(value: string): string {
  return `'${escapeSqlString(value)}'`;
}
