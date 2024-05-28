<template>
  <div class="-pt-16 min-h-screen">
    <AppHeader />

    <div class="min-h-screen px-6 py-32">
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
