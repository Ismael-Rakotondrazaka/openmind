<template>
  <div class="mx-auto flex h-full w-full max-w-lg items-center justify-center">
    <PrimeCard>
      <template #title>
        <h1>OpenMind</h1>
      </template>

      <template #subtitle>
        <p>Unleash Your Thoughts, Explore Every Topic.</p>
      </template>

      <template #content>
        <picture class="mb-5 block w-full max-w-xs">
          <img src="/images/logo.svg" alt="Logo" class="w-full object-cover" />
        </picture>

        <p class="text-center">
          Created by
          <a
            href="https://github.com/Ismael-Rakotondrazaka"
            target="_blank"
            class="text-primary hover:underline"
            >Ismael</a
          >
        </p>
      </template>

      <template #footer>
        <p>Version {{ config.public.appVersion }}</p>
      </template>
    </PrimeCard>
  </div>
</template>

<script lang="ts" setup>
defineOgImageComponent("DefaultOgImage");

const config = useRuntimeConfig();
</script>

<style></style>
