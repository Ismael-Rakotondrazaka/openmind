import type { OutputData } from '@editorjs/editorjs';

import edjsHTML from 'editorjs-html';
import DOMPurify from 'isomorphic-dompurify';

interface ImageData {
  caption?: string;
  file: { url: string };
  stretched?: boolean;
  withBackground?: boolean;
  withBorder?: boolean;
}

interface ListData {
  items: ListItem[];
  style: 'checklist' | 'ordered' | 'unordered';
}

interface ListItem {
  content: string;
  items?: ListItem[];
  meta?: { checked?: boolean };
}

const renderListItems = (items: ListItem[], style: string): string =>
  items
    .map(item => {
      const nested = item.items?.length
        ? renderListBlock({
            items: item.items,
            style: style as ListData['style'],
          })
        : '';
      if (style === 'checklist') {
        const checked = item.meta?.checked ? ' checked' : '';
        return `<li><input type="checkbox"${checked} disabled /> ${item.content}${nested}</li>`;
      }
      return `<li>${item.content}${nested}</li>`;
    })
    .join('');

const renderListBlock = (data: ListData): string => {
  const items = renderListItems(data.items, data.style);
  if (data.style === 'ordered') return `<ol>${items}</ol>`;
  if (data.style === 'checklist') return `<ul class="checklist">${items}</ul>`;
  return `<ul>${items}</ul>`;
};

const parser = edjsHTML({
  image: ({ data }: { data: ImageData }) => {
    const figureClasses = [
      data.withBorder ? 'with-border' : '',
      data.withBackground ? 'with-background' : '',
      data.stretched ? 'stretched' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const imgClasses =
      'aspect-video w-full rounded-md object-cover object-center';
    const img = `<img src="${data.file.url}" alt="${data.caption ?? ''}" class="${imgClasses}" />`;
    return `<figure${figureClasses ? ` class="${figureClasses}"` : ''}>${img}${data.caption ? `<figcaption>${data.caption}</figcaption>` : ''}</figure>`;
  },
  list: ({ data }: { data: ListData }) => renderListBlock(data),
});

const renderEditorJs = (content: OutputData) => {
  if (!content) return '';
  const raw = parser.parse(content);
  const html = Array.isArray(raw) ? raw.join('') : (raw as string);
  return DOMPurify.sanitize(html, {
    ADD_ATTR: ['checked', 'disabled', 'type', 'class'],
    ADD_TAGS: ['input'],
  });
};

export const useRenderEditorHTML = (
  content: MaybeRefOrGetter<Serialize<OutputData> | undefined>
) => {
  return computed(() => renderEditorJs(toValue(content) as OutputData));
};
