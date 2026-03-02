import type { OutputBlockData, OutputData } from '@editorjs/editorjs';

import { type HTMLElement, parse } from 'node-html-parser';

const BLOCK_TAGS = new Set(['H2', 'H3', 'IMG', 'P', 'UL']);

export function htmlToEditorJsOutput(html: string): OutputData {
  const root = parse(html);
  const elements = getBlockLevelElements(root);
  const blocks: OutputBlockData[] = [];

  for (const el of elements) {
    const tag = el.tagName;
    const id = generateBlockId();

    if (tag === 'H2') {
      blocks.push({
        data: { level: 2, text: textContent(el) },
        id,
        type: 'header',
      });
      continue;
    }
    if (tag === 'H3') {
      blocks.push({
        data: { level: 3, text: textContent(el) },
        id,
        type: 'header',
      });
      continue;
    }
    if (tag === 'P') {
      const text = innerHTML(el) || textContent(el);
      if (text) {
        blocks.push({
          data: { text },
          id,
          type: 'paragraph',
        });
      }
      continue;
    }
    if (tag === 'UL') {
      const items = el
        .querySelectorAll('li')
        .map(li => textContent(li as HTMLElement));
      if (items.length > 0) {
        blocks.push({
          data: { items, type: 'unordered' },
          id,
          type: 'list',
        });
      }
      continue;
    }
    if (tag === 'IMG') {
      const src = el.getAttribute('src') ?? '';
      const caption = el.getAttribute('alt') ?? '';
      if (src) {
        blocks.push({
          data: {
            caption,
            file: { url: src },
          },
          id,
          type: 'image',
        });
      }
    }
  }

  return {
    blocks,
    time: Date.now(),
    version: '2.31.3',
  };
}

function generateBlockId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
}

function getBlockLevelElements(root: HTMLElement): HTMLElement[] {
  const selector = Array.from(BLOCK_TAGS)
    .map(t => t.toLowerCase())
    .join(', ');
  return root.querySelectorAll(selector);
}

function innerHTML(el: HTMLElement): string {
  return (el.innerHTML ?? '').trim();
}

function textContent(el: HTMLElement): string {
  return (el.textContent ?? '').trim();
}
