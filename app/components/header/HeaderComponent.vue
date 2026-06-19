<script setup lang="ts">
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const { user } = useUserSession();

const userImageUrlProps = computed(() => ({
  firstName: user.value?.firstName ?? null,
  imageUrl: user.value?.imageUrl ?? null,
  lastName: user.value?.lastName ?? null,
}));

const imageUrl = useUserImageUrl(() => userImageUrlProps.value);
</script>

<template>
  <ClientOnly>
    <HeaderPublic v-if="!user" />
    <HeaderAuth v-else :image-url="imageUrl" :username="user?.username || ''" />
    <template #fallback>
      <HeaderPublic />
    </template>
  </ClientOnly>
</template>
