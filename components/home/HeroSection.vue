<template>
  <div
    class="relative flex h-full w-full flex-wrap justify-center gap-7 bg-white p-10 text-gray-900 lg:flex-nowrap lg:justify-between lg:gap-[unset]"
  >
    <div class="flex w-full items-center justify-center">
      <div class="w-full">
        <p
          class="mb-4 text-xl font-semibold uppercase text-primary md:text-2xl"
        >
          Unleash Your Thoughts, Explore Every Topic.
        </p>
        <h1
          class="m-0 mb-4 flex w-[600px] items-center text-4xl font-semibold md:text-6xl"
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

    <div class="min-w-40, h-full w-full md:w-1/3">
      <img src="/images/logo.svg" class="h-full w-full object-contain" />
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style></style>
