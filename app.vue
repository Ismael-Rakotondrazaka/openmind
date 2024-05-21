<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup></script>

<style>
html {
  scroll-behavior: smooth;
}
.page-leave-from {
  opacity: 0.5;
}
.page-leave-to {
  opacity: 0;
}
.page-enter-from {
  opacity: 0;
}
.page-enter-to {
  opacity: 1;
}
.page-leave-active {
  transition: all 1s;
  position: absolute;
  inset: 0;
  top: 8rem;
}
.page-enter-active {
  transition: all 1s;
}
</style>
