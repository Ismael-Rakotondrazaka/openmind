<script lang="ts" setup>
import { useGetUsers } from '~/features/shared/users/composables/useGetUsers';
import { formatFallbackUrl } from '~/features/users/composables/useUserImageUrl';
import UserProfilePage from '~/features/users/pages/UserProfilePage.vue';

const route = useRoute('u-userKey');

const { data: usersData } = useGetUsers(() => ({
  limit: 1,
  username: route.params.userKey,
}));

const profile = computed(() => usersData.value?.data[0] ?? null);

const profileName = computed(() => {
  const user = profile.value;
  if (!user) return undefined;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ');
  return fullName || user.username || undefined;
});

const profileImage = computed(
  () =>
    profile.value?.image_url ??
    formatFallbackUrl(profile.value?.first_name, profile.value?.last_name)
);

const profileDescription = computed(() => {
  const user = profile.value;
  if (!user?.username) return undefined;

  if (profileName.value) {
    return `View ${profileName.value}'s profile (${user.username}) on OpenMind.`;
  }

  return `View ${user.username}'s profile on OpenMind.`;
});

useSeoMeta({
  description: () => profileDescription.value,
  ogDescription: () => profileDescription.value,
  ogImage: () => profileImage.value,
  ogTitle: () => {
    const user = profile.value;
    if (!user?.username) return 'OpenMind';

    if (profileName.value) {
      return `${profileName.value} (${user.username})`;
    }

    return user.username;
  },
  ogType: 'profile',
  title: () => {
    const user = profile.value;
    if (!user?.username) return 'OpenMind';

    if (profileName.value) {
      return `${profileName.value} (${user.username}) | OpenMind`;
    }

    return `${user.username} | OpenMind`;
  },
  twitterCard: 'summary',
  twitterDescription: () => profileDescription.value,
  twitterImage: () => profileImage.value,
  twitterTitle: () => {
    const user = profile.value;
    if (!user?.username) return 'OpenMind';

    if (profileName.value) {
      return `${profileName.value} (${user.username})`;
    }

    return user.username;
  },
});
</script>

<template>
  <div class="min-h-svh">
    <UserProfilePage />
  </div>
</template>

<style></style>
