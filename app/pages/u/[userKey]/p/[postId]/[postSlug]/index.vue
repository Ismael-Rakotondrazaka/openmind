<template>
  <div class="min-h-svh py-2">
    <PostPage v-if="data" :post="data" />
  </div>
</template>

<script lang="ts" setup>
import { useGetPost } from '~/features/shared/posts/composables/useGetPost';
import PostPage from '~/features/shared/posts/pages/PostPage.vue';
import { formatFallbackUrl } from '~/features/users/composables/useUserImageUrl';

const route = useRoute('u-userKey-p-postId-postSlug');

const { data } = useGetPost(() => route.params.postId);

const authorName = computed(() => {
  const author = data.value?.author;
  if (!author) return undefined;
  return (
    [author.first_name, author.last_name].filter(Boolean).join(' ') || undefined
  );
});

const postImage = computed(
  () =>
    data.value?.cover_url ??
    formatFallbackUrl(
      data.value?.author?.first_name,
      data.value?.author?.last_name
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
