<template>
  <div>
    <h1 class="mb-2 line-clamp-2 text-lg font-bold text-slate-900 md:text-xl">
      <NuxtLink
        :to="{
          name: 'u-userKey-p-postId-postSlug',
          params: {
            userKey: post.author.username || post.author.id,
            postId: post.id,
            postSlug: post.slug,
          },
        }"
        >{{ post.title }}</NuxtLink
      >
    </h1>

    <div class="mb-2 space-x-1">
      <Badge v-for="tag in post.tags" :key="tag.tag.id" variant="secondary">
        {{ tag.tag.value }}
      </Badge>
    </div>

    <figure v-if="post.cover_url !== null" class="mb-3">
      <NuxtLink
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
          :src="post.cover_url"
          class="aspect-video w-full rounded-md object-cover object-center"
          :alt="post.title"
        />
      </NuxtLink>
    </figure>
  </div>
</template>

<script lang="ts" setup>
import Badge from '~/components/ui/badge/Badge.vue';

import type { Post } from '../post.model';

type Props = {
  post: Post;
};

defineProps<Props>();
</script>
