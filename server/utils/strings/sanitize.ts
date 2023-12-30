import xss from "xss";

export const sanitize = (input: string): string => xss(input);
