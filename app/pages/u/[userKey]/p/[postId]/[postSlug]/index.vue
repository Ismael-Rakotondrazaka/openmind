<template>
  <div class="min-h-svh py-2">
    <PostPage v-if="data" :post="data" />
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@pinia/colada';

import PostPage from '~/features/shared/posts/pages/PostPage.vue';
import { postByIdQuery } from '~/features/shared/posts/post.query';
import { formatFallbackUrl } from '~/features/users/composables/useUserImageUrl';

const route = useRoute('u-userKey-p-postId-postSlug');
const fetchFn = useRequestFetch();

const { data } = useQuery(() =>
  postByIdQuery({ fetchFn, id: route.params.postId as string })
);

const authorName = computed(() => {
  const author = data.value?.author;
  if (!author) return undefined;
  return (
    [author.firstName, author.lastName].filter(Boolean).join(' ') || undefined
  );
});

const postImage = computed(
  () =>
    data.value?.coverUrl ??
    formatFallbackUrl(
      data.value?.author?.firstName,
      data.value?.author?.lastName
    )
);

const metaDescription = computed(() => {
  if (!data.value?.title) return undefined;

  if (authorName.value) {
    return `Read ${data.value.title} by ${authorName.value} on Openmind.`;
  }

  return `Read ${data.value.title} on Openmind.`;
});

useSeoMeta({
  description: () => metaDescription.value,
  ogDescription: () => metaDescription.value,
  ogImage: () => postImage.value,
  ogTitle: () => data.value?.title ?? 'Openmind',
  ogType: 'article',
  title: () => data.value?.title ?? 'Openmind',
  twitterCard: 'summary_large_image',
  twitterDescription: () => metaDescription.value,
  twitterImage: () => postImage.value,
  twitterTitle: () => data.value?.title ?? 'Openmind',
});
</script>

<style scoped></style>
