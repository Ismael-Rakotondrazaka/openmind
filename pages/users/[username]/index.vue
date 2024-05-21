<template>
  <ShowUser v-if="user !== null" class="mx-auto w-full max-w-[700px]" />
  <NotFoundPage v-else />
</template>

<script lang="ts" setup>
const route = useRoute("users-username");

const { user } = useShowUser({
  params: () => ({
    username: route.params.username,
  }),
  immediate: true,
});

const { user: authUser } = useAuthUser();

provide(AuthUserToken, {
  user: authUser,
});

provide(ShowUserToken, {
  user,
} as ShowUserDI);
</script>
