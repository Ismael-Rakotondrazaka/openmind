<script lang="ts" setup>
import NotificationsPage from '~/features/shared/notifications/pages/NotificationsPage.vue';

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  title: 'Notifications',
  twitterCard: 'summary_large_image',
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
    <NotificationsPage />
  </div>
</template>
