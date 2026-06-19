<script lang="ts" setup>
import { useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import { userByIdQuery } from '@/features/shared/users/user.query';

import EditEmailCard from '../components/EditEmailCard.vue';
import EditEmailCardSkeleton from '../components/EditEmailCardSkeleton.vue';
import EditPasswordCard from '../components/EditPasswordCard.vue';
import EditPasswordCardSkeleton from '../components/EditPasswordCardSkeleton.vue';
import EditProfileCard from '../components/EditProfileCard.vue';
import EditProfileCardSkeleton from '../components/EditProfileCardSkeleton.vue';
import NotificationPreferencesCard from '../components/NotificationPreferencesCard.vue';
import NotificationPreferencesCardSkeleton from '../components/NotificationPreferencesCardSkeleton.vue';

const { t } = useI18n();
const { user: authUser } = useUserSession();
const fetchFn = useRequestFetch();

const { data: user, isLoading: isUserPending } = useQuery(() => ({
  ...userByIdQuery({ fetchFn, id: authUser.value?.id ?? '' }),
  enabled: Boolean(authUser.value?.id),
}));

const email = computed(() => authUser.value?.email ?? '');
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <h1 class="mb-6 text-2xl font-bold">{{ t('users.settings') }}</h1>

    <ClientOnly>
      <EditProfileCardSkeleton v-if="isUserPending" class="mb-5" />
      <EditProfileCard v-else-if="user" :user="user" class="mb-5" />

      <EditEmailCardSkeleton v-if="!authUser" class="mb-5" />
      <EditEmailCard v-else-if="email" :email="email" class="mb-5" />

      <EditPasswordCardSkeleton v-if="isUserPending" class="mb-5" />
      <EditPasswordCard v-else class="mb-5" />

      <NotificationPreferencesCardSkeleton v-if="!authUser" class="mb-5" />
      <NotificationPreferencesCard v-else class="mb-5" />
    </ClientOnly>
  </div>
</template>
