<template>
  <div class="pt-16">
    <AppHeader />

    <div class="min-h-screen">
      <slot />
    </div>
    <AppFooter />
    <PrimeScrollTop />
  </div>
</template>

<script lang="ts" setup>
import AppFooter from "~/components/footers/AppFooter.vue";
import AppHeader from "~/components/headers/AppHeader.vue";
</script>

<style></style>
