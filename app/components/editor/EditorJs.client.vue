<script setup lang="ts">
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import { nanoid } from 'nanoid';
import slugify from 'slugify';

import { POST_FILES_BUCKET } from '~/features/shared/posts/post.config';

const content = defineModel<OutputData>('content', {
  default: () => ({
    blocks: [],
  }),
  required: false,
});

const holderId = useId();
const client = useSupabaseClient();
const user = useSupabaseUser();

let editor: EditorJS | null = null;

async function uploadFile(file: File): Promise<string> {
  if (!user.value?.sub) throw new Error('Not authenticated');
  const lastDot = file.name.lastIndexOf('.');
  const baseName = lastDot > 0 ? file.name.slice(0, lastDot) : file.name;
  const ext = lastDot > 0 ? file.name.slice(lastDot) : '';
  const sanitizedName = slugify(baseName, { lower: true, strict: true });
  const path = `${user.value.sub}/openmind__${sanitizedName}__${nanoid()}${ext}`;
  const { error } = await client.storage
    .from(POST_FILES_BUCKET)
    .upload(path, file, { upsert: false });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = client.storage.from(POST_FILES_BUCKET).getPublicUrl(path);
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
