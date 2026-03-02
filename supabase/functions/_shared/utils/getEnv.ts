export const getEnv = (key: string): string => {
  const value = Deno.env.get(key);

  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
};
