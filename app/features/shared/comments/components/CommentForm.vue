<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';

import { Button } from '@/components/ui/button';

import { useCreateComment } from '../composables/useCreateComment';

type Props = {
  depth?: number;
  parentId?: null | string;
  postId: string;
  title?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{ submitted: [] }>();

const user = useSupabaseUser();
const content = ref<OutputData>({ blocks: [] });
const editorKey = ref(0);
const { isPending, mutateAsync } = useCreateComment();

const isEmpty = computed(
  () =>
    !content.value.blocks.length ||
    content.value.blocks.every(
      b => !b.data || (typeof b.data.text === 'string' && !b.data.text.trim())
    )
);

const handleSubmit = async () => {
  if (isEmpty.value || !user.value?.sub) return;

  await mutateAsync({
    author_id: user.value.sub,
    content: content.value as unknown as Tables<'comments'>['content'],
    depth: props.depth ?? 0,
    parent_id: props.parentId ?? null,
    post_id: props.postId,
  });

  content.value = { blocks: [] };
  editorKey.value++;
  emit('submitted');
};
</script>

<template>
  <form v-if="user" class="flex flex-col gap-2" @submit.prevent="handleSubmit">
    <p v-if="title" class="text-muted-foreground text-sm">{{ title }}</p>
    <EditorJs
      :key="editorKey"
      v-model:content="content"
      class="min-h-16 w-full rounded-md border"
    />
    <div class="flex justify-end">
      <Button type="submit" size="sm" :disabled="isPending || isEmpty">
        <Icon v-if="isPending" name="mdi:loading" class="animate-spin" />
        <Icon v-else name="mdi:send" />
        {{ parentId ? 'Reply' : 'Comment' }}
      </Button>
    </div>
  </form>
</template>
