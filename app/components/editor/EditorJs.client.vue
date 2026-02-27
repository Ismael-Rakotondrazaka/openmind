<script setup lang="ts">
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

const content = defineModel<OutputData>('content', {
  default: () => ({
    blocks: [],
  }),
  required: false,
});

const holderId = useId();

let editor: EditorJS | null = null;

onMounted(() => {
  editor = new EditorJS({
    data: content.value,
    holder: holderId,
    async onChange(api) {
      const data = await api.saver.save();
      content.value = data;
    },
    tools: {
      header: Header,
      list: List,
      paragraph: Paragraph,
    },
  });
});

onBeforeUnmount(() => {
  editor?.destroy();
});
</script>

<template>
  <div :id="holderId" class="prose w-full max-w-none" />
</template>
