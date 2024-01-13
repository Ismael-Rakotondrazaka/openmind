export const countHtmlAsTextLength = (element: HTMLElement): number => {
  let textLength = 0;

  // ! Node is not accessible in backend
  // Node.TEXT_NODE
  const nodeTextNode: number = 3;
  // Node.ELEMENT_NODE;
  const nodeElementNode: number = 1;

  const countText = (node: Node): void => {
    if (node.nodeType === nodeTextNode) {
      textLength += (node.textContent || "").length;
    } else if (node.nodeType === nodeElementNode) {
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
