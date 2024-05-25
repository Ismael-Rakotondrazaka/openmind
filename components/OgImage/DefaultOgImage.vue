<template>
  <div
    class="relative flex h-full w-full flex-nowrap justify-between bg-white p-10 text-gray-900"
  >
    <div class="flex items-center justify-center">
      <div class="w-full">
        <p class="mb-4 text-[24px] font-semibold uppercase text-[#14b8a6]">
          Unleash Your Thoughts, Explore Every Topic.
        </p>
        <h1
          class="m-0 mb-4 flex w-[600px] items-center text-[75px] font-semibold"
        >
          <span>OpenMind</span>
        </h1>
        <p class="text-[32px] leading-tight text-secondary">
          {{ config.public.appUrl }}
        </p>
      </div>
    </div>

    <div class="h-full w-1/3">
      <img src="/images/logo.svg" class="h-full w-full object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
