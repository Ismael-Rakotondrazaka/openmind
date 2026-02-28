<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateFollow } from '~/features/shared/follows/composables/useCreateFollow';
import { useDeleteFollow } from '~/features/shared/follows/composables/useDeleteFollow';
import { useGetFollowByRelationship } from '~/features/shared/follows/composables/useGetFollowByRelationship';
import { useGetUserTagsWithDetails } from '~/features/shared/user-tags/composables/useGetUserTagsWithDetails';
import { useGetUsers } from '~/features/shared/users/composables/useGetUsers';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import ProfileActions from '~/features/users/components/ProfileActions.vue';
import ProfileFollowersTab from '~/features/users/components/ProfileFollowersTab.vue';
import ProfileFollowingTab from '~/features/users/components/ProfileFollowingTab.vue';
import ProfileHeader from '~/features/users/components/ProfileHeader.vue';
import ProfilePostsTab from '~/features/users/components/ProfilePostsTab.vue';
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
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <div v-if="profile">
      <ProfileHeader
        :profile="profile"
        :profile-image-url="profileImageUrl"
        :profile-fullname="profileFullname"
        :tags="tags"
      />

      <ProfileActions
        :is-owner="isOwner"
        :is-authenticated="Boolean(authUser)"
        :is-following="isFollowing"
        :is-follow-loading="isFollowLoading"
        :share-url="shareUrl"
        @follow-toggle="handleFollowToggle"
      />

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

        <TabsContent value="posts">
          <ProfilePostsTab :profile-id="profile.id" />
        </TabsContent>

        <TabsContent value="followers">
          <ProfileFollowersTab :profile-id="profile.id" />
        </TabsContent>

        <TabsContent value="following">
          <ProfileFollowingTab :profile-id="profile.id" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>

<style></style>
