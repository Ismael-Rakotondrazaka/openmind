<template>
  <div>
    <h1 class="mb-2 line-clamp-2 text-lg font-bold text-slate-900 md:text-xl">
      <NuxtLinkLocale
        :to="{
          name: 'u-userKey-p-postId-postSlug',
          params: {
            userKey: post.author.username || post.author.id,
            postId: post.id,
            postSlug: post.slug,
          },
        }"
        >{{ post.title }}</NuxtLinkLocale
      >
    </h1>

    <div class="mb-2 space-x-1">
      <Badge v-for="tag in post.tags" :key="tag.tag.id" variant="secondary">
        {{ tag.tag.value }}
      </Badge>
    </div>

    <figure v-if="post.coverUrl !== null" class="mb-3">
      <NuxtLinkLocale
        :to="{
          name: 'u-userKey-p-postId-postSlug',
          params: {
            userKey: post.author.username || post.author.id,
            postId: post.id,
            postSlug: post.slug,
          },
        }"
      >
        <img
          :src="post.coverUrl"
          class="aspect-video w-full rounded-md object-cover object-center"
          :alt="post.title"
        />
      </NuxtLinkLocale>
    </figure>

    <p
      v-if="contentPreview"
      class="text-muted-foreground mb-3 line-clamp-5 text-sm"
    >
      {{ contentPreview }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';
import type { PostListItem } from '#shared/features/posts';

import Badge from '~/components/ui/badge/Badge.vue';

type Props = {
  post: Serialize<PostListItem>;
};

const props = defineProps<Props>();

const contentPreview = computed(() => {
  if (!('content' in props.post)) return '';

  const blocks = (props.post.content as OutputData)?.blocks;
  if (!blocks?.length) return '';
  return blocks
    .filter(
      block => typeof (block.data as { text?: string })?.text === 'string'
    )
    .map(block => (block.data as { text: string }).text.replace(/<[^>]*>/g, ''))
    .join(' ');
});
</script>
