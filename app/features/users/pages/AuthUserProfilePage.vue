<script lang="ts" setup>
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetUserTagsWithDetails } from '~/features/shared/user-tags/composables/useGetUserTagsWithDetails';
import { useGetUser } from '~/features/shared/users/composables/useGetUser';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import ProfileActions from '~/features/users/components/ProfileActions.vue';
import ProfileFollowersTab from '~/features/users/components/ProfileFollowersTab.vue';
import ProfileFollowingTab from '~/features/users/components/ProfileFollowingTab.vue';
import ProfileHeader from '~/features/users/components/ProfileHeader.vue';
import ProfilePostsTab from '~/features/users/components/ProfilePostsTab.vue';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const authUser = useSupabaseUser();
const config = useRuntimeConfig();
const router = useRouter();

const { data: profile } = useGetUser(() => authUser.value?.sub);

const profileFullname = useUserFullname(() => profile.value ?? {});
const profileImageUrl = useUserImageUrl(() => profile.value ?? {});

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
        :is-owner="true"
        :is-authenticated="true"
        :is-following="false"
        :is-follow-loading="false"
        :share-url="shareUrl"
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
          <ProfilePostsTab :profile-id="profile.id" :is-own-profile="true" />
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
