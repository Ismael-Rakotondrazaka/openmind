<template>
  <UpdateUserForm
    v-if="user !== null"
    :user="user"
    class="mx-auto w-full max-w-[700px]"
  />
  <NotFoundPage v-else />
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
