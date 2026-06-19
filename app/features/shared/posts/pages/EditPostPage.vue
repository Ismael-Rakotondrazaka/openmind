<script lang="ts" setup>
import { useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import EditPostForm from '../components/EditPostForm.vue';
import { postByIdQuery } from '../post.query';

const { t } = useI18n();
const route = useRoute('posts-postId-edit');
const postId = computed(() => route.params.postId as string);
const fetchFn = useRequestFetch();

const {
  data: post,
  error,
  isLoading,
} = useQuery(() => postByIdQuery({ fetchFn, id: postId.value }));
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <div v-if="isLoading" class="text-muted-foreground py-12 text-center">
      {{ t('buttons.loadingPost') }}
    </div>
    <div v-else-if="error || !post" class="py-12 text-center text-red-500">
      {{ t('posts.notFound') }}
    </div>
    <EditPostForm v-else :post="post" />
  </div>
</template>

<style></style>
