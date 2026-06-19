<script lang="ts" setup>
import { useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { userTagListQuery } from '~/features/shared/user-tags/user-tag.query';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { userByIdQuery } from '~/features/shared/users/user.query';
import ProfileActions from '~/features/users/components/ProfileActions.vue';
import ProfileFollowersTab from '~/features/users/components/ProfileFollowersTab.vue';
import ProfileFollowingTab from '~/features/users/components/ProfileFollowingTab.vue';
import ProfileHeader from '~/features/users/components/ProfileHeader.vue';
import ProfilePostsTab from '~/features/users/components/ProfilePostsTab.vue';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const { t } = useI18n();
const { user: authUser } = useUserSession();
const config = useRuntimeConfig();
const router = useRouter();
const localePath = useLocalePath();
const fetchFn = useRequestFetch();

const { data: profile } = useQuery(() => ({
  ...userByIdQuery({ fetchFn, id: authUser.value?.id ?? '' }),
  enabled: Boolean(authUser.value?.id),
}));

const profileFullname = useUserFullname(
  () => profile.value ?? {},
  t('users.defaultUsername')
);
const profileImageUrl = useUserImageUrl(() => profile.value ?? {});

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
