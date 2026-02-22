<template>
  <address class="mb-3 flex items-center not-italic">
    <div
      class="mr-3 inline-flex items-center gap-2 text-sm text-gray-900 dark:text-white"
    >
      <Avatar>
        <AvatarImage :src="authorImageUrl" :alt="authorFullname" />
        <AvatarFallback>
          {{ authorFullname.charAt(0) }}
        </AvatarFallback>
      </Avatar>

      <div>
        <NuxtLink
          :to="{
            name: 'u-userKey',
            params: {
              userKey: post.author.username || post.author.id,
            },
          }"
          class="text-text hover:text-primary inline-block font-bold hover:underline"
        >
          {{ authorFullname }}
        </NuxtLink>

        <PostPublishDate :date="post.published_at || post.created_at" />
      </div>
    </div>
  </address>
</template>

<script lang="ts" setup>
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import type { Post } from '../post.model';

import PostPublishDate from './PostPublishDate.vue';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

const authorImageUrl = useUserImageUrl(() => props.post.author);
const authorFullname = useUserFullname(() => props.post.author);
</script>
