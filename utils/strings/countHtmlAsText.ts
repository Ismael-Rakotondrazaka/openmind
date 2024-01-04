export const countHtmlAsTextLength = (element: HTMLElement): number => {
  let textLength = 0;

  const countText = (node: Node): void => {
    if (node.nodeType === /* Node.TEXT_NODE */ 3) {
      textLength += (node.textContent || "").length;
    } else if (node.nodeType === /* Node.ELEMENT_NODE */ 1) {
      const tagName = (node as Element).tagName.toLowerCase();

      const atomicElements = [
        "img",
        "br",
        "hr",
        "input",
        "button",
        "video",
        "audio",
        "area",
        "iframe",
      ];
      if (atomicElements.includes(tagName)) {
        textLength += 1;
      } else {
        for (const childNode of Array.from(node.childNodes)) {
          countText(childNode);
        }
      }
    }
  };

  countText(element);
  return textLength;
};

// Example usage:
/* const htmlString = "<div><p>here</p><img src=\"/emoji.jpg\" />hello world</div><p>cool<br /><span>glass</span></p>";
const parser = new JSDOM(htmlString);
// const doc = parser.parseFromString(htmlString, "text/html");

const result = countHtmlAsTextLength(parser.window.document.body);
console.log(result); // Output: 26 */
