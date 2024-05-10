<template>
  <div class="flex items-center justify-center min-h-screen p-5">
    <UpdateUserForm v-if="user !== null" :user="user" />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
});

const route = useRoute("users-username-edit");

const { user } = useShowUser({
  params: () => ({
    username: route.params.username,
  }),
  immediate: true,
});
</script>
