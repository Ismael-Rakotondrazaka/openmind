<template>
  <IndexUser class="mx-auto w-full max-w-[700px]" />
</template>

<script lang="ts" setup>
const { user: authUser } = useAuthUser();

provide(AuthUserToken, {
  user: authUser,
});
</script>

<style></style>
-
