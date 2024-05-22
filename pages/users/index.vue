<template>
  <div class="mx-auto w-full max-w-[700px]">
    <PageTitle>Users</PageTitle>
    <IndexUser />
  </div>
</template>

<script lang="ts" setup>
defineOgImageComponent("DefaultOgImage");

const { user: authUser } = useAuthUser();

provide(AuthUserToken, {
  user: authUser,
});
</script>

<style></style>
