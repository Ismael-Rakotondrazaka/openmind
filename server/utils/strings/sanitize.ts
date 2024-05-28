import xss from "xss";

export const sanitize = (input: string): string =>
  xss(input, {
    onIgnoreTagAttr: (tag, name, value) => {
      if (
        // allow class on all tag
        name === "class" ||
        // on rel on links
        (name === "rel" && tag === "a" && value === "noopener noreferrer") ||
        (name === "target" && tag === "a" && value === "_blank") ||
        (name === "href" && tag === "a" && value.startsWith("/")) ||
        // on src on images
        (name === "src" && tag === "img") ||
        (name === "alt" && tag === "img")
      ) {
        return `${name}=${value}`;
      }

      if (name === "style") {
        return `${name}="${value}"`;
      }
    },
  });
