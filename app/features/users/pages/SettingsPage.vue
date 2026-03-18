<script lang="ts" setup>
import { useGetUser } from '@/features/shared/users/composables/useGetUser';
import { useGetAuthClaims } from '~/features/auth/composables/useGetAuthClaims';

import EditEmailCard from '../components/EditEmailCard.vue';
import EditEmailCardSkeleton from '../components/EditEmailCardSkeleton.vue';
import EditPasswordCard from '../components/EditPasswordCard.vue';
import EditPasswordCardSkeleton from '../components/EditPasswordCardSkeleton.vue';
import EditProfileCard from '../components/EditProfileCard.vue';
import EditProfileCardSkeleton from '../components/EditProfileCardSkeleton.vue';
import NotificationPreferencesCard from '../components/NotificationPreferencesCard.vue';
import NotificationPreferencesCardSkeleton from '../components/NotificationPreferencesCardSkeleton.vue';

const authUser = useSupabaseUser();
const { data: claims, isPending: isClaimsPending } = useGetAuthClaims();
const { data: user, isPending: isUserPending } = useGetUser(
  () => authUser.value?.sub
);
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-6 text-2xl font-bold">Settings</h1>

    <EditProfileCardSkeleton v-if="isUserPending" class="mb-5" />
    <EditProfileCard v-else-if="user" :user="user" class="mb-5" />

    <EditEmailCardSkeleton v-if="isClaimsPending" class="mb-5" />
    <EditEmailCard
      v-else-if="claims?.email"
      :email="claims.email"
      class="mb-5"
    />

    <EditPasswordCardSkeleton
      v-if="isUserPending || isClaimsPending"
      class="mb-5"
    />
    <EditPasswordCard v-else class="mb-5" />

    <NotificationPreferencesCardSkeleton v-if="!authUser" class="mb-5" />
    <NotificationPreferencesCard v-else class="mb-5" />
  </div>
</template>
