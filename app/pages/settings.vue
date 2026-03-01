<script lang="ts" setup>
import SettingsPage from '~/features/users/pages/SettingsPage.vue';

const authUser = useSupabaseUser();

watchEffect(() => {
  if (authUser.value === null) {
    navigateTo('/login');
  }
});
</script>

<template>
  <div class="min-h-svh">
    <SettingsPage />
  </div>
</template>
