<script lang="ts" setup>
import { useGetUser } from '@/features/shared/users/composables/useGetUser';
import { useGetAuthClaims } from '~/features/auth/composables/useGetAuthClaims';

import EditEmailCard from '../components/EditEmailCard.vue';
import EditProfileCard from '../components/EditProfileCard.vue';

const authUser = useSupabaseUser();
const { data: claims } = useGetAuthClaims();
const { data: user, isLoading: isUserLoading } = useGetUser(
  () => authUser.value?.sub
);
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-6 text-2xl font-bold">Settings</h1>

    <pre>{{ JSON.stringify(claims, null, 2) }}</pre>
    <br />
    {{ user }}

    <div v-if="isUserLoading" class="mb-5 flex justify-center py-10">
      <Spinner />
    </div>

    <EditProfileCard v-if="user" :user="user" class="mb-5" />

    <EditEmailCard v-if="claims?.email" :email="claims.email" class="mb-5" />
  </div>
</template>
