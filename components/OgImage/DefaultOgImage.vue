<template>
  <div
    class="w-full h-full flex-nowrap flex justify-between relative p-10 bg-white text-gray-900"
  >
    <div class="flex items-center justify-center">
      <div class="w-full">
        <p class="uppercase text-[24px] text-[#14b8a6] mb-4 font-semibold">
          Unleash Your Thoughts, Explore Every Topic.
        </p>
        <h1
          class="w-[600px] m-0 text-[75px] font-semibold mb-4 flex items-center"
        >
          <span>OpenMind</span>
        </h1>
        <p class="text-[32px] text-secondary leading-tight">
          {{ config.public.appUrl }}
        </p>
      </div>
    </div>

    <div class="h-full w-1/3">
      <img src="/images/logo.svg" class="w-full h-full object-contain" />
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
