<script lang="ts" setup>
import { useGetUser } from '@/features/shared/users/composables/useGetUser';

import EditProfileCard from '../components/EditProfileCard.vue';
const authUser = useSupabaseUser();
const { data: user, isLoading } = useGetUser(() => authUser.value?.sub);
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-6 text-2xl font-bold">Settings</h1>

    <div v-if="isLoading" class="flex justify-center py-10">
      <Spinner />
    </div>

    <EditProfileCard v-if="user" :user="user" />
  </div>
</template>
