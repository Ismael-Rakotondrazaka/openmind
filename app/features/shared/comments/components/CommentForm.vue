<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';

import { useMutation } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';

import { useStoreComment } from '../comment.query';

const { t } = useI18n();

type Props = {
  depth?: number;
  parentId?: null | string;
  postId: string;
  title?: string;
};

const props = defineProps<Props>();

const emit = defineEmits<{ cancelled: []; submitted: [] }>();

const { user } = useUserSession();
const content = ref<OutputData>({ blocks: [] });
const editorKey = ref(0);
const { isLoading: isPending, mutateAsync } = useMutation(useStoreComment());

const isEmpty = computed(
  () =>
    !content.value.blocks.length ||
    content.value.blocks.every(
      b => !b.data || (typeof b.data.text === 'string' && !b.data.text.trim())
    )
);

const handleSubmit = async () => {
  if (isEmpty.value || !user.value?.id) return;

  await mutateAsync({
    body: {
      content: content.value,
      parentId: props.parentId ?? null,
      postId: props.postId,
    },
  });

  content.value = { blocks: [] };
  editorKey.value++;
  emit('submitted');
};
</script>

<template>
  <ClientOnly>
    <form
      v-if="user"
      class="flex flex-col gap-2"
      @submit.prevent="handleSubmit"
    >
      <p v-if="title" class="text-muted-foreground text-sm">{{ title }}</p>
      <EditorJs
        :key="editorKey"
        v-model:content="content"
        class="min-h-16 w-full rounded-md border pb-2"
      />
      <div class="flex justify-end gap-2">
        <Button
          v-if="parentId"
          type="button"
          size="sm"
          variant="ghost"
          :disabled="isPending"
          @click="emit('cancelled')"
        >
          {{ t('buttons.cancel') }}
        </Button>
        <Button type="submit" size="sm" :disabled="isPending || isEmpty">
          <Icon v-if="isPending" name="mdi:loading" class="animate-spin" />
          <Icon v-else name="mdi:send" />
          {{ parentId ? t('buttons.reply') : t('buttons.comment') }}
        </Button>
      </div>
    </form>
    <template #fallback>
      <div class="rounded-md border border-dashed p-4 text-center">
        <p class="text-muted-foreground text-sm">
          <NuxtLink to="/auth/login" class="text-primary hover:underline">
            {{ t('buttons.login') }}
          </NuxtLink>
          {{ t('toasts.mustBeLoggedIn') }}
        </p>
      </div>
    </template>
  </ClientOnly>
</template>
