<template>
  <div class="w-full max-w-2xl mx-auto my-7">
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
-
