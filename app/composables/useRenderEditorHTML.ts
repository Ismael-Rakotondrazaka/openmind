import type { OutputData } from '@editorjs/editorjs';

import edjsHTML from 'editorjs-html';
import DOMPurify from 'isomorphic-dompurify';

const parser = edjsHTML();

const renderEditorJs = (content: OutputData) => {
  if (!content) return '';
  const raw = parser.parse(content);
  return DOMPurify.sanitize(raw);
};

export const useRenderEditorHTML = (content: MaybeRefOrGetter<OutputData>) => {
  return computed(() => renderEditorJs(toValue(content)));
};
