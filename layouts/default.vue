<template>
  <div class="min-h-screen -pt-16">
    <AppHeader />

    <div class="min-h-screen py-32 px-6">
      <slot />
    </div>
    <AppFooter />
    <PrimeScrollTop />
    <PrimeToast position="top-right" />
  </div>
</template>

<script lang="ts" setup>
import AppFooter from "~/components/footers/AppFooter.vue";
import AppHeader from "~/components/headers/AppHeader.vue";
</script>

<style></style>
