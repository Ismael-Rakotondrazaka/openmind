<script lang="ts" setup>
import type { Post } from '#shared/features/posts';

import { useMutation, useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';
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

import {
  savedPostIsSavedQuery,
  useToggleSavedPost,
} from '../../saved-posts/saved-post.query';
import PostPublishDate from './PostPublishDate.vue';

const { t } = useI18n();

type Props = {
  post: Serialize<Post>;
};

const props = defineProps<Props>();

const localePath = useLocalePath();

const authorImageUrl = useUserImageUrl(() => props.post.author);
const authorFullname = useUserFullname(
  () => props.post.author,
  t('users.defaultUsername')
);

const { user } = useUserSession();

const isAuthor = computed(() => user.value?.id === props.post.author.id);

const hasVisibleMenuOptions = computed(() => !!user.value || isAuthor.value);

const fetchFn = useRequestFetch();

const { data: isPostSaved } = useQuery(() =>
  savedPostIsSavedQuery({ fetchFn, postId: props.post.id })
);

const { mutateAsync: toggleSaved } = useMutation(useToggleSavedPost());

const handleSavePost = async () => {
  await toggleSaved({ body: { postId: props.post.id } });
  toast.success(t('toasts.post.saved'));
};

const handleDeleteSavedPost = async () => {
  await toggleSaved({ body: { postId: props.post.id } });
  toast.info(t('toasts.post.saved'));
};

const router = useRouter();

const goBack = () => {
  if (window?.history?.length > 1) {
    router.back();
  } else {
    navigateTo(localePath({ name: 'index' }));
  }
};
</script>

<template>
  <div class="mb-3 flex items-center justify-between">
    <address class="not-italic">
      <div
        class="mr-3 inline-flex items-center gap-2 text-sm text-gray-900 dark:text-white"
      >
        <Button
          variant="ghost"
          size="icon"
          class="rounded-full"
          @click="goBack"
        >
          <Icon name="mdi:arrow-left" size="1rem" />
        </Button>
        <Avatar>
          <AvatarImage :src="authorImageUrl" :alt="authorFullname" />
          <AvatarFallback>
            {{ authorFullname.charAt(0) }}
          </AvatarFallback>
        </Avatar>
        <div>
          <NuxtLinkLocale
            :to="{
              name: 'u-userKey',
              params: {
                userKey: post.author.username || post.author.id,
              },
            }"
            class="text-text hover:text-primary inline-block font-bold hover:underline"
          >
            {{ authorFullname }}
          </NuxtLinkLocale>
          <PostPublishDate :date="post.publishedAt || post.createdAt" />
        </div>
      </div>
    </address>

    <DropdownMenu v-if="hasVisibleMenuOptions">
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" size="icon">
          <Icon name="mdi:dots-vertical" size="1rem" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem v-if="user && !isPostSaved" @click="handleSavePost">
            {{ t('posts.saveForLater') }}
            <DropdownMenuShortcut>
              <Icon name="mdi:bookmark" size="1rem" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuItem
            v-if="user && isPostSaved"
            variant="destructive"
            @click="handleDeleteSavedPost"
          >
            {{ t('posts.removeFromSaved') }}
            <DropdownMenuShortcut>
              <Icon name="mdi:bookmark-remove" size="1rem" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <NuxtLinkLocale
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
              {{ t('buttons.edit') }}
              <DropdownMenuShortcut>
                <Icon name="mdi:pencil" size="1rem" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </NuxtLinkLocale>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
