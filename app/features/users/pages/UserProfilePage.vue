<script lang="ts" setup>
import { refDebounced, useClipboard } from '@vueuse/core';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateFollow } from '~/features/shared/follows/composables/useCreateFollow';
import { useDeleteFollow } from '~/features/shared/follows/composables/useDeleteFollow';
import { useGetFollowByRelationship } from '~/features/shared/follows/composables/useGetFollowByRelationship';
import { useGetFollowing } from '~/features/shared/follows/composables/useGetFollowing';
import { useGetFollows } from '~/features/shared/follows/composables/useGetFollows';
import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import PostCard from '~/features/shared/posts/components/PostCard.vue';
import { useGetPosts } from '~/features/shared/posts/composables/useGetPosts';
import { useGetTags } from '~/features/shared/tags/composables/useGetTags';
import { useGetUserTagsWithDetails } from '~/features/shared/user-tags/composables/useGetUserTagsWithDetails';
import { useGetUsers } from '~/features/shared/users/composables/useGetUsers';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import ProfileUserListItem from '~/features/users/components/ProfileUserListItem.vue';
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

// --- Tabs ---

// Posts tab
const postSearch = ref('');
const debouncedPostSearch = refDebounced(postSearch, 300);
const selectedTagIds = ref<string[]>([]);
const postsPage = ref(1);
const postsLimit = ref(10);

watch([debouncedPostSearch, selectedTagIds], () => {
  postsPage.value = 1;
});

const toggleTag = (tagId: string) => {
  const idx = selectedTagIds.value.indexOf(tagId);
  if (idx === -1) {
    selectedTagIds.value = [...selectedTagIds.value, tagId];
  } else {
    selectedTagIds.value = selectedTagIds.value.filter(id => id !== tagId);
  }
};

const isTagPopoverOpen = ref(false);
const tagSearch = ref('');

const { data: allTagsData } = useGetTags(() => ({ limit: 100 }));
const allTags = computed(() => allTagsData.value?.data ?? []);

const filteredTagOptions = computed(() => {
  const search = tagSearch.value.toLowerCase();
  if (!search) return allTags.value;
  return allTags.value.filter(t => t.value.toLowerCase().includes(search));
});

const selectedTagObjects = computed(() =>
  allTags.value.filter(t => selectedTagIds.value.includes(t.id))
);

const { data: postsData, isPending: isPostsPending } = useGetPosts(() => ({
  author_id: profile.value?.id,
  limit: postsLimit.value,
  page: postsPage.value,
  search: debouncedPostSearch.value || undefined,
  status: 'published',
  tagIds: selectedTagIds.value.length ? selectedTagIds.value : undefined,
}));

const postsTotalPages = computed(() =>
  Math.ceil((postsData.value?.count ?? 0) / postsLimit.value)
);

// Followers tab
const followerSearch = ref('');
const followersPage = ref(1);
const followersLimit = ref(10);

const { data: followersData, isPending: isFollowersPending } = useGetFollows(
  () => ({
    following_id: profile.value?.id,
    limit: followersLimit.value,
    page: followersPage.value,
  })
);

const followersTotalPages = computed(() =>
  Math.ceil((followersData.value?.count ?? 0) / followersLimit.value)
);

const filteredFollowers = computed(() => {
  const search = followerSearch.value.toLowerCase();
  return (followersData.value?.data ?? []).filter(
    f =>
      !search ||
      f.follower.username?.toLowerCase().includes(search) ||
      f.follower.first_name?.toLowerCase().includes(search) ||
      f.follower.last_name?.toLowerCase().includes(search)
  );
});

// Following tab
const followingSearch = ref('');
const followingPage = ref(1);
const followingLimit = ref(10);

const { data: followingData, isPending: isFollowingPending } = useGetFollowing(
  () => ({
    follower_id: profile.value?.id,
    limit: followingLimit.value,
    page: followingPage.value,
  })
);

const followingTotalPages = computed(() =>
  Math.ceil((followingData.value?.count ?? 0) / followingLimit.value)
);

const filteredFollowing = computed(() => {
  const search = followingSearch.value.toLowerCase();
  return (followingData.value?.data ?? []).filter(
    f =>
      !search ||
      f.following.username?.toLowerCase().includes(search) ||
      f.following.first_name?.toLowerCase().includes(search) ||
      f.following.last_name?.toLowerCase().includes(search)
  );
});
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
          <p class="text-muted-foreground mb-2 text-sm">
            {{ profile.username }}
          </p>
          <div v-if="tags.length > 0" class="flex flex-wrap gap-2">
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

      <Tabs default-value="posts">
        <TabsList class="w-full">
          <TabsTrigger value="posts">
            {{ toNumericAbbreviation(profile.posts_count) }} Posts
          </TabsTrigger>
          <TabsTrigger value="followers">
            {{ toNumericAbbreviation(profile.follower_count) }} Followers
          </TabsTrigger>
          <TabsTrigger value="following">
            {{ toNumericAbbreviation(profile.following_count) }} Following
          </TabsTrigger>
        </TabsList>

        <!-- Posts tab -->
        <TabsContent value="posts" class="mt-4 flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <Input v-model="postSearch" placeholder="Search posts..." />
            <div class="flex flex-wrap items-center gap-2">
              <Popover v-model:open="isTagPopoverOpen">
                <PopoverTrigger as-child>
                  <Button variant="outline" size="sm" class="gap-1.5">
                    <Icon name="mdi:tag-outline" size="1rem" />
                    Tags
                    <Badge
                      v-if="selectedTagIds.length"
                      variant="secondary"
                      class="px-1.5 py-0 text-xs"
                    >
                      {{ selectedTagIds.length }}
                    </Badge>
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-56 p-2" align="start">
                  <Input
                    v-model="tagSearch"
                    placeholder="Search tags..."
                    class="mb-2 h-8 text-sm"
                  />
                  <div class="max-h-48 overflow-y-auto">
                    <p
                      v-if="filteredTagOptions.length === 0"
                      class="text-muted-foreground py-3 text-center text-sm"
                    >
                      No tags found.
                    </p>
                    <button
                      v-for="tag in filteredTagOptions"
                      :key="tag.id"
                      type="button"
                      class="hover:bg-accent flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm"
                      @click="toggleTag(tag.id)"
                    >
                      <Icon
                        name="mdi:check"
                        size="0.875rem"
                        :class="
                          selectedTagIds.includes(tag.id)
                            ? 'opacity-100'
                            : 'opacity-0'
                        "
                      />
                      {{ tag.value }}
                    </button>
                  </div>
                </PopoverContent>
              </Popover>

              <Badge
                v-for="tag in selectedTagObjects"
                :key="tag.id"
                variant="secondary"
                class="gap-1 pr-1"
              >
                {{ tag.value }}
                <button
                  type="button"
                  class="hover:text-destructive ml-0.5 rounded"
                  @click="toggleTag(tag.id)"
                >
                  <Icon name="mdi:close" size="0.75rem" />
                </button>
              </Badge>
            </div>
          </div>

          <div v-if="isPostsPending" class="text-muted-foreground text-sm">
            Loading...
          </div>
          <template v-else>
            <PostCard
              v-for="post in postsData?.data"
              :key="post.id"
              :post="post"
            />
            <p
              v-if="!postsData?.data?.length"
              class="text-muted-foreground py-6 text-center text-sm"
            >
              No posts yet.
            </p>
            <Pagination
              v-if="(postsData?.count ?? 0) > postsLimit"
              :limit="postsLimit"
              :page="postsPage"
              :total-count="postsData?.count ?? 0"
              :total-pages="postsTotalPages"
              @page-change="postsPage = $event"
              @page-size-change="postsLimit = $event"
            />
          </template>
        </TabsContent>

        <!-- Followers tab -->
        <TabsContent value="followers" class="mt-4 flex flex-col gap-4">
          <Input v-model="followerSearch" placeholder="Search followers..." />

          <div v-if="isFollowersPending" class="text-muted-foreground text-sm">
            Loading...
          </div>
          <template v-else>
            <ProfileUserListItem
              v-for="follow in filteredFollowers"
              :key="follow.id"
              :user="follow.follower"
            />
            <p
              v-if="!filteredFollowers.length"
              class="text-muted-foreground py-6 text-center text-sm"
            >
              No followers yet.
            </p>
            <Pagination
              v-if="(followersData?.count ?? 0) > followersLimit"
              :limit="followersLimit"
              :page="followersPage"
              :total-count="followersData?.count ?? 0"
              :total-pages="followersTotalPages"
              @page-change="followersPage = $event"
              @page-size-change="followersLimit = $event"
            />
          </template>
        </TabsContent>

        <!-- Following tab -->
        <TabsContent value="following" class="mt-4 flex flex-col gap-4">
          <Input v-model="followingSearch" placeholder="Search following..." />

          <div v-if="isFollowingPending" class="text-muted-foreground text-sm">
            Loading...
          </div>
          <template v-else>
            <ProfileUserListItem
              v-for="follow in filteredFollowing"
              :key="follow.id"
              :user="follow.following"
            />
            <p
              v-if="!filteredFollowing.length"
              class="text-muted-foreground py-6 text-center text-sm"
            >
              No following yet.
            </p>
            <Pagination
              v-if="(followingData?.count ?? 0) > followingLimit"
              :limit="followingLimit"
              :page="followingPage"
              :total-count="followingData?.count ?? 0"
              :total-pages="followingTotalPages"
              @page-change="followingPage = $event"
              @page-size-change="followingLimit = $event"
            />
          </template>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<style></style>
