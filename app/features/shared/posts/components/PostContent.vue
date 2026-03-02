<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    class="prose container mx-auto mb-2 max-w-none"
    v-html="renderEditorHTML"
  />
</template>

<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';

type Props = {
  content: OutputData;
};

const props = defineProps<Props>();

const renderEditorHTML = useRenderEditorHTML(() => props.content);
</script>
