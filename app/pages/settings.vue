<script lang="ts" setup>
import SettingsPage from '~/features/users/pages/SettingsPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/images/og-openmind.png',
});

const authUser = useSupabaseUser();

watchEffect(() => {
  if (authUser.value === null) {
    navigateTo('/login');
  }
});
</script>

<template>
  <div class="min-h-svh py-2">
    <SettingsPage />
  </div>
</template>
