<template>
  <address class="mb-3 flex items-center justify-between not-italic">
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

    <div class="flex flex-row items-center justify-end gap-2">
      <Badge v-if="post.status === PostStatus.draft" variant="destructive">
        {{ PostStatusLabel[post.status] }}
      </Badge>

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
                name: 'posts-postId-edit',
                params: {
                  postId: post.id,
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
  </address>
</template>

<script lang="ts" setup>
import { toast } from 'vue-sonner';

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

import { useCreateSavedPost } from '../../saved-posts/composables/useCreateSavedPost';
import { useDeleteSavedPost } from '../../saved-posts/composables/useDeleteSavedPost';
import { useIsPostSaved } from '../../saved-posts/composables/useIsPostSaved';
import { type Post, PostStatus, PostStatusLabel } from '../post.model';
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
  if (!user.value?.sub) return;
  await createSavedPost.mutateAsync({
    post_id: props.post.id,
    user_id: user.value.sub,
  });
  toast.success('Post saved');
};

const deleteSavedPost = useDeleteSavedPost();

const handleDeleteSavedPost = async () => {
  if (!user.value?.sub) return;
  await deleteSavedPost.mutateAsync({
    postId: props.post.id,
    userId: user.value.sub,
  });
  toast.info('Post removed from saved');
};
</script>
