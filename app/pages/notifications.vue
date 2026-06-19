<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import NotificationsPage from '~/features/shared/notifications/pages/NotificationsPage.vue';

const { t } = useI18n();

definePageMeta({
  middleware: 'auth',
});

useSeoMeta({
  ogImage: '/images/og-openmind.png',
  title: computed(() => t('notifications.notificationsTitle')),
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="min-h-svh py-2">
    <NotificationsPage />
  </div>
</template>
