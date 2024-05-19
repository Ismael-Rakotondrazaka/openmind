<template>
  <div class="mx-auto w-full max-w-[700px]">
    <div>I'm protected! Session data: {{ data }}</div>
    <button class="rounded-xl shadow-xl p-2 m-2" @click="signOut()">
      sign out
    </button>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const { data, signOut } = useAuth();
</script>
