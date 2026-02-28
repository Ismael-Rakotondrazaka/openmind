<script lang="ts" setup>
import { useClipboard } from '@vueuse/core';
import { toast } from 'vue-sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCreateFollow } from '~/features/shared/follows/composables/useCreateFollow';
import { useDeleteFollow } from '~/features/shared/follows/composables/useDeleteFollow';
import { useGetFollowByRelationship } from '~/features/shared/follows/composables/useGetFollowByRelationship';
import { useGetUserTagsWithDetails } from '~/features/shared/user-tags/composables/useGetUserTagsWithDetails';
import { useGetUsers } from '~/features/shared/users/composables/useGetUsers';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const route = useRoute('u-userKey');
const authUser = useSupabaseUser();
const config = useRuntimeConfig();
const router = useRouter();

const { data: usersData } = useGetUsers(() => ({
  username: route.params.userKey,
}));

const profile = computed(() => usersData.value?.data[0] ?? null);

const profileFullname = useUserFullname(() => profile.value ?? {});
const profileImageUrl = useUserImageUrl(() => profile.value ?? {});

const isOwner = computed(() => authUser.value?.sub === profile.value?.id);

const { data: userTagsData } = useGetUserTagsWithDetails(
  () => profile.value?.id
);

const tags = computed(() => userTagsData.value ?? []);

const shareUrl = computed(() => {
  const resolved = router.resolve({
    name: 'u-userKey',
    params: { userKey: profile.value?.username || profile.value?.id || '' },
  });
  return `${config.public.appUrl}${resolved.fullPath}`;
});

const { data: followData, isPending: isFollowPending } =
  useGetFollowByRelationship(
    () => authUser.value?.sub,
    () => profile.value?.id
  );

const existingFollow = computed(() => followData.value?.data[0] ?? null);
const isFollowing = computed(() => Boolean(existingFollow.value));

const { isPending: isCreatingFollow, mutate: createFollow } = useCreateFollow();
const { isPending: isDeletingFollow, mutate: deleteFollow } = useDeleteFollow();

const isFollowLoading = computed(
  () =>
    isFollowPending.value || isCreatingFollow.value || isDeletingFollow.value
);

const handleFollowToggle = () => {
  if (isFollowing.value && existingFollow.value) {
    deleteFollow(existingFollow.value.id);
  } else if (authUser.value?.sub && profile.value?.id) {
    createFollow({
      follower_id: authUser.value.sub,
      following_id: profile.value.id,
    });
  }
};

const { copy } = useClipboard();
const handleCopyShareUrl = async () => {
  try {
    await copy(shareUrl.value);
    toast.success('Share URL copied to clipboard');
  } catch {
    toast.error('Failed to copy share URL');
  }
};
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <div v-if="profile">
      <div class="mb-6 flex flex-col items-center gap-3">
        <Avatar class="size-20">
          <AvatarImage :src="profileImageUrl" :alt="profileFullname" />
          <AvatarFallback>{{ profileFullname.charAt(0) }}</AvatarFallback>
        </Avatar>

        <div class="text-center">
          <h1 class="text-xl font-bold">{{ profileFullname }}</h1>
          <p class="text-muted-foreground text-sm">{{ profile.username }}</p>
        </div>
      </div>

      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <NuxtLink v-if="isOwner" to="/posts/new" as-child>
            <Button>
              <Icon name="mdi:plus" />
              New article
            </Button>
          </NuxtLink>

          <Button
            v-if="authUser && !isOwner"
            :variant="isFollowing ? 'outline' : 'default'"
            :disabled="isFollowLoading"
            @click="handleFollowToggle"
          >
            <Icon
              :name="isFollowing ? 'mdi:account-check' : 'mdi:account-plus'"
            />
            {{ isFollowing ? 'Following' : 'Follow' }}
          </Button>
        </div>

        <div class="flex items-center gap-2">
          <Popover>
            <PopoverTrigger as-child>
              <Button variant="outline">
                <Icon name="mdi:share-variant" />
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-80">
              <div class="grid gap-4">
                <div class="space-y-2">
                  <h4 class="leading-none font-medium">Share</h4>
                </div>

                <div class="flex flex-row flex-nowrap items-center gap-2">
                  <Input disabled class="w-full" :default-value="shareUrl" />
                  <Button
                    variant="secondary"
                    size="icon"
                    @click="handleCopyShareUrl"
                  >
                    <Icon name="mdi:content-copy" />
                    <span class="sr-only">Copy</span>
                  </Button>
                </div>

                <div class="flex flex-row items-center justify-start gap-2">
                  <SocialShare
                    network="email"
                    :styled="true"
                    :label="false"
                    :url="shareUrl"
                  />
                  <SocialShare
                    network="facebook"
                    :styled="true"
                    :label="false"
                    :url="shareUrl"
                  />
                  <SocialShare
                    network="x"
                    :styled="true"
                    :label="false"
                    :url="shareUrl"
                  />
                  <SocialShare
                    network="linkedin"
                    :styled="true"
                    :label="false"
                    :url="shareUrl"
                  />
                  <SocialShare
                    network="whatsapp"
                    :styled="true"
                    :label="false"
                    :url="shareUrl"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu v-if="isOwner">
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="icon">
                <Icon name="mdi:dots-horizontal" size="1rem" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem as-child>
                  <NuxtLink to="/profile/edit">Edit profile</NuxtLink>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Separator class="mb-4" />

      <div v-if="tags.length > 0">
        <p class="mb-2 text-base font-bold">Tags preference:</p>
        <div class="flex flex-wrap gap-2">
          <Badge
            v-for="userTag in tags"
            :key="userTag.tag_id"
            variant="secondary"
            class="rounded-full"
          >
            {{ userTag.tag.value }}
          </Badge>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
