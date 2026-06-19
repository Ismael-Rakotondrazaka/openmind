<script lang="ts" setup>
import { useQuery } from '@pinia/colada';

import { userListQuery } from '~/features/shared/users/user.query';
import { formatFallbackUrl } from '~/features/users/composables/useUserImageUrl';
import UserProfilePage from '~/features/users/pages/UserProfilePage.vue';

const route = useRoute('u-userKey');
const fetchFn = useRequestFetch();

const { data: usersData } = useQuery(() =>
  userListQuery({ fetchFn, username: route.params.userKey as string })
);

const profile = computed(() => usersData.value?.data[0] ?? null);

const profileName = computed(() => {
  const user = profile.value;
  if (!user) return undefined;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return fullName || user.username || undefined;
});

const profileImage = computed(
  () =>
    profile.value?.imageUrl ??
    formatFallbackUrl(profile.value?.firstName, profile.value?.lastName)
);

const profileDescription = computed(() => {
  const user = profile.value;
  if (!user?.username) return undefined;

  if (profileName.value) {
    return `View ${profileName.value}'s profile (${user.username}) on Openmind.`;
  }

  return `View ${user.username}'s profile on Openmind.`;
});

useSeoMeta({
  description: () => profileDescription.value,
  ogDescription: () => profileDescription.value,
  ogImage: () => profileImage.value,
  ogTitle: () => {
    const user = profile.value;
    if (!user?.username) return 'Openmind';

    if (profileName.value) {
      return `${profileName.value} (${user.username})`;
    }

    return user.username;
  },
  ogType: 'profile',
  title: () => {
    const user = profile.value;
    if (!user?.username) return 'Openmind';

    if (profileName.value) {
      return `${profileName.value} (${user.username}) | Openmind`;
    }

    return `${user.username} | Openmind`;
  },
  twitterCard: 'summary',
  twitterDescription: () => profileDescription.value,
  twitterImage: () => profileImage.value,
  twitterTitle: () => {
    const user = profile.value;
    if (!user?.username) return 'Openmind';

    if (profileName.value) {
      return `${profileName.value} (${user.username})`;
    }

    return user.username;
  },
});
</script>

<template>
  <div class="min-h-svh py-2">
    <UserProfilePage />
  </div>
</template>

<style></style>
