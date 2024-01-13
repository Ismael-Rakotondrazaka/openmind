export const extractNamePart = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, "");
};
