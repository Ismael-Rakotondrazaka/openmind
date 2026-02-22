<script lang="ts" setup>
import { toast } from 'vue-sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import type { Post } from '../post.model';

import { useCreateSavedPost } from '../../saved-posts/composables/useCreateSavedPost';
import { useDeleteSavedPost } from '../../saved-posts/composables/useDeleteSavedPost';
import { useIsPostSaved } from '../../saved-posts/composables/useIsPostSaved';
import PostPublishDate from './PostPublishDate.vue';

type Props = {
  post: Post;
};

const props = defineProps<Props>();

const authorImageUrl = useUserImageUrl(() => props.post.author);
const authorFullname = useUserFullname(() => props.post.author);

const user = useSupabaseUser();

const isAuthor = computed(() => user.value?.sub === props.post.author.id);

const { data: isPostSaved } = useIsPostSaved(() => ({
  postId: props.post.id,
  userId: user.value?.sub,
}));

const createSavedPost = useCreateSavedPost();

const handleSavePost = async () => {
  if (!user.value?.sub) {
    return;
  }

  await createSavedPost.mutateAsync({
    post_id: props.post.id,
    user_id: user.value.sub,
  });

  toast.success('Post saved');
};

const deleteSavedPost = useDeleteSavedPost();

const handleDeleteSavedPost = async () => {
  if (!user.value?.sub) {
    return;
  }

  await deleteSavedPost.mutateAsync({
    postId: props.post.id,
    userId: user.value.sub,
  });

  toast.info('Post removed from saved');
};
</script>

<template>
  <div class="mb-3 flex items-center justify-between">
    <address class="not-italic">
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

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon">
          <Icon name="mdi:dots-vertical" size="1rem" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem v-if="!isPostSaved" @click="handleSavePost">
            Save for later
            <DropdownMenuShortcut>
              <Icon name="mdi:bookmark" size="1rem" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            v-else
            variant="destructive"
            @click="handleDeleteSavedPost"
          >
            Remove from saved
            <DropdownMenuShortcut>
              <Icon name="mdi:bookmark-remove" size="1rem" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <NuxtLink
            v-if="isAuthor"
            :to="{
              name: 'u-userKey-p-postId-postSlug-edit',
              params: {
                userKey: post.author.username || post.author.id,
                postId: post.id,
                postSlug: post.slug,
              },
            }"
            as-child
          >
            <DropdownMenuItem>
              Edit
              <DropdownMenuShortcut>
                <Icon name="mdi:pencil" size="1rem" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </NuxtLink>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
