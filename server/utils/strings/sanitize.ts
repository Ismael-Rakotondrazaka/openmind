import xss from "xss";

export const sanitize = (input: string): string =>
  xss(input, {
    onIgnoreTagAttr: (tag, name, value) => {
      if (
        // allow class on all tag
        name === "class" ||
        // on rel on links
        (name === "rel" && tag === "a" && value === "noopener noreferrer")
      ) {
        return `${name}=${value}`;
      }
    },
  });
