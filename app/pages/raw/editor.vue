<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container mx-auto my-20 min-h-svh bg-amber-200">
    <EditorJs v-model:content="content" class="min-h-svh bg-yellow-500" />
    <div class="prose container mx-auto min-h-svh max-w-none bg-blue-500">
      {{ JSON.stringify(content, null, 2) }}
    </div>
    <div class="prose container mx-auto min-h-svh max-w-none bg-green-500">
      {{ JSON.stringify(renderEditorHTML, null, 2) }}
    </div>
    <div class="prose container mx-auto max-w-none" v-html="renderEditorHTML" />
  </div>
</template>

<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';

const content = ref<OutputData>({
  blocks: [
    {
      data: {
        caption: 'Hello',
        file: {
          url: 'http://127.0.0.1:54321/storage/v1/object/public/post-files/99cc962e-f1a5-4fa0-9667-db4c9afc8918/openmind__screenshot-2025-09-18-141717__Sa424lWXZAwTS__AWH5JL.png',
        },
        stretched: true,
        withBackground: true,
        withBorder: true,
      },
      id: 'D0eLNKiaza',
      type: 'image',
    },
    {
      data: { level: 2, text: 'Hello' },
      id: '-deYCTvmlZ',
      type: 'header',
    },
    {
      data: { text: 'sadfsadf' },
      id: '26fK1JBvYN',
      type: 'paragraph',
    },
    {
      data: {
        items: [
          { content: 'afa', items: [], meta: {} },
          { content: 'sdaf', items: [], meta: {} },
          { content: 'asdf', items: [], meta: {} },
        ],
        meta: {},
        style: 'unordered',
      },
      id: 'Z0QDV07bVC',
      type: 'list',
    },
    {
      data: {
        items: [
          { content: 'afasd', items: [], meta: {} },
          { content: 'asdfas', items: [], meta: {} },
          { content: 'asdfsa', items: [], meta: {} },
        ],
        meta: { counterType: 'numeric' },
        style: 'ordered',
      },
      id: 'YmCLljJ5uD',
      type: 'list',
    },
    {
      data: {
        items: [
          { content: 'asfadf', items: [], meta: { checked: false } },
          { content: 'asdfasdf', items: [], meta: { checked: true } },
          { content: 'fsadf', items: [], meta: { checked: false } },
          { content: 'adfaf', items: [], meta: { checked: true } },
        ],
        meta: {},
        style: 'checklist',
      },
      id: '1lTOr_FbUf',
      type: 'list',
    },
    {
      data: { text: 'safsaf' },
      id: '7WtHmpvNLz',
      type: 'paragraph',
    },
  ],
  time: 1772219611881,
  version: '2.31.3',
});

const renderEditorHTML = useRenderEditorHTML(content);
</script>

<style></style>
