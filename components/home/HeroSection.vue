<template>
  <div
    class="w-full h-full flex-wrap lg:flex-nowrap gap-7 lg:gap-[unset] flex justify-center lg:justify-between relative p-10 bg-white text-gray-900"
  >
    <div class="flex w-full items-center justify-center">
      <div class="w-full">
        <p
          class="uppercase text-xl md:text-2xl text-primary mb-4 font-semibold"
        >
          Unleash Your Thoughts, Explore Every Topic.
        </p>
        <h1
          class="w-[600px] m-0 text-4xl md:text-6xl font-semibold mb-4 flex items-center"
        >
          <span>OpenMind</span>
        </h1>
        <NuxtLink
          :to="{
            name: 'articles',
          }"
        >
          <PrimeButton icon="pi pi-arrow-right" label="Start reading" />
        </NuxtLink>
      </div>
    </div>

    <div class="h-full w-full min-w-40, md:w-1/3">
      <img src="/images/logo.svg" class="w-full h-full object-contain" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
