<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <h1 class="mb-2 line-clamp-2 text-lg font-bold text-slate-900 md:text-xl">
      {{ post.title }}
    </h1>

    <div class="mb-2 space-x-1">
      <Badge v-for="tag in post.tags" :key="tag.tag.id" variant="secondary">
        {{ tag.tag.value }}
      </Badge>
    </div>

    <figure v-if="post.coverUrl !== null" class="mb-3">
      <img
        :src="post.coverUrl"
        class="aspect-video w-full rounded-md object-cover object-center"
        :alt="post.title"
      />
    </figure>
  </div>
</template>

<script lang="ts" setup>
import type { Post } from '#shared/features/posts';

import Badge from '~/components/ui/badge/Badge.vue';

type Props = {
  post: Serialize<Post>;
};

defineProps<Props>();
</script>
