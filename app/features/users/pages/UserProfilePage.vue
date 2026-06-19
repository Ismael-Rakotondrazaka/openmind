<script lang="ts" setup>
import { useMutation, useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  followByRelationshipQuery,
  useToggleFollow,
} from '~/features/shared/follows/follow.query';
import { userTagListQuery } from '~/features/shared/user-tags/user-tag.query';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { userListQuery } from '~/features/shared/users/user.query';
import ProfileActions from '~/features/users/components/ProfileActions.vue';
import ProfileFollowersTab from '~/features/users/components/ProfileFollowersTab.vue';
import ProfileFollowingTab from '~/features/users/components/ProfileFollowingTab.vue';
import ProfileHeader from '~/features/users/components/ProfileHeader.vue';
import ProfilePostsTab from '~/features/users/components/ProfilePostsTab.vue';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const { t } = useI18n();
const route = useRoute('u-userKey');
const { user: authUser } = useUserSession();
const config = useRuntimeConfig();
const router = useRouter();
const localePath = useLocalePath();

const fetchFn = useRequestFetch();

const { data: usersData } = useQuery(() =>
  userListQuery({ fetchFn, username: route.params.userKey as string })
);

const profile = computed(() => usersData.value?.data[0] ?? null);

const profileFullname = useUserFullname(
  () => profile.value ?? {},
  t('users.defaultUsername')
);
const profileImageUrl = useUserImageUrl(() => profile.value ?? {});

const isOwner = computed(() => authUser.value?.id === profile.value?.id);

const { data: userTagsData } = useQuery(() => ({
  ...userTagListQuery(
    profile.value?.id ? { fetchFn, userId: profile.value.id } : { fetchFn }
  ),
  enabled: Boolean(profile.value?.id),
}));

const tags = computed(() => userTagsData.value?.data ?? []);

const shareUrl = computed(() => {
  const resolved = router.resolve(
    localePath({
      name: 'u-userKey',
      params: { userKey: profile.value?.username || profile.value?.id || '' },
    })
  );
  return `${config.public.appUrl}${resolved.fullPath}`;
});

const { data: followData, isLoading: isFollowPending } = useQuery(() =>
  followByRelationshipQuery({
    fetchFn,
    followerId: authUser.value?.id,
    followingId: profile.value?.id,
  })
);

const isFollowing = computed(() => (followData.value?.count ?? 0) > 0);

const { isLoading: isTogglingFollow, mutate: toggleFollowMutate } =
  useMutation(useToggleFollow());

const isFollowLoading = computed(
  () => isFollowPending.value || isTogglingFollow.value
);

const handleFollowToggle = () => {
  if (!profile.value?.id) return;
  toggleFollowMutate({ body: { followingId: profile.value.id } });
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
            {{ toNumericAbbreviation(profile.postsCount) }}
            {{ t('users.postsTab') }}
          </TabsTrigger>
          <TabsTrigger value="followers">
            {{ toNumericAbbreviation(profile.followerCount) }}
            {{ t('users.followersTab') }}
          </TabsTrigger>
          <TabsTrigger value="following">
            {{ toNumericAbbreviation(profile.followingCount) }}
            {{ t('users.followingTab') }}
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
