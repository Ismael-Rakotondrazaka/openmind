<template>
  <div class="mx-auto w-full max-w-[700px]">
    <PageTitle>Users</PageTitle>
    <IndexUser />
  </div>
</template>

<script lang="ts" setup>
const { user: authUser } = useAuthUser();

provide(AuthUserToken, {
  user: authUser,
});
</script>

<style></style>
