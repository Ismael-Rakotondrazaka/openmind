<script setup lang="ts">
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

const user = useSupabaseUser();

const imageUrl = useUserImageUrl({
  first_name: user?.value?.user_metadata?.first_name,
  image_url: user?.value?.user_metadata?.image_url,
  last_name: user?.value?.user_metadata?.last_name,
});
</script>
<template>
  <HeaderPublic v-if="!user" />
  <HeaderAuth
    v-else
    :image-url="imageUrl"
    :username="user?.value?.user_metadata?.username || ''"
  />
</template>
