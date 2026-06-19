<script setup lang="ts">
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import { useI18n } from 'vue-i18n';

const content = defineModel<OutputData>('content', {
  default: () => ({
    blocks: [],
  }),
  required: false,
});

const holderId = useId();
const { user } = useUserSession();
const { t } = useI18n();

let editor: EditorJS | null = null;

async function uploadFile(file: File): Promise<string> {
  if (!user.value) throw new Error(t('common.auth.notAuthenticated'));

  const { publicUrl, uploadUrl } = await $fetch<{
    path: string;
    publicUrl: string;
    uploadUrl: string;
  }>('/api/storage/posts/files/presign', {
    body: { contentType: file.type, fileName: file.name },
    method: 'POST',
  });

  await fetch(uploadUrl, {
    body: file,
    headers: { 'Content-Type': file.type },
    method: 'PUT',
  });

  return publicUrl;
}

onMounted(() => {
  editor = new EditorJS({
    // @editorjs/list v2 calls structuredClone() on block data internally, which throws a
    // DOMException when passed a Vue reactive Proxy. Deep-cloning to a plain object first
    // works around this bug: https://github.com/editor-js/list/issues/142
    data: JSON.parse(JSON.stringify(toRaw(content.value))),
    holder: holderId,
    async onChange(api) {
      const data = await api.saver.save();
      content.value = data;
    },
    tools: {
      header: Header,
      image: {
        class: ImageTool,
        config: {
          uploader: {
            async uploadByFile(file: File) {
              const url = await uploadFile(file);
              return { file: { url }, success: 1 };
            },
            async uploadByUrl(url: string) {
              return { file: { url }, success: 1 };
            },
          },
        },
      },
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
