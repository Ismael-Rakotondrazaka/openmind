<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="container mx-auto my-20 min-h-svh bg-amber-200">
    <EditorJs v-model:content="content" class="min-h-svh bg-yellow-500" />
    <div class="prose container mx-auto min-h-svh max-w-none bg-blue-500">
      {{ JSON.stringify(content, null, 2) }}
    </div>
    <div
      class="prose container mx-auto min-h-svh max-w-none bg-green-500"
      v-html="renderEditorHTML"
    />
  </div>
</template>

<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';

const content = ref<OutputData>({
  blocks: [],
});

const renderEditorHTML = useRenderEditorHTML(content);
</script>

<style></style>
