<template>
  <div
    v-if="user !== undefined"
    class="relative flex h-full w-full flex-col items-center justify-between bg-white p-10 text-gray-900"
  >
    <div class="flex w-full flex-col items-center justify-center">
      <img
        v-if="user.profileUrl !== null"
        class="mr-3 h-64 w-64 rounded-full object-cover"
        :src="user.profileUrl"
        :alt="`${user.firstName} ${user.name}`"
      />
      <p v-else class="h-64 w-64 rounded-full object-cover">
        {{ user.firstName[0] }}
      </p>

      <div
        class="flex flex-col items-center gap-1"
        :style="{
          alignItems: 'center',
        }"
      >
        <p class="text-5xl font-bold text-text">
          {{ `${user.firstName} ${user.name}` }}
        </p>
        <p class="text-3xl text-gray-500">
          {{ user.username }}
        </p>
      </div>
    </div>

    <div class="flex w-full flex-row items-center justify-center text-left">
      <img src="/images/logo.svg" alt="Logo" class="mr-5 h-16 w-16" />

      <p style="font-size: 25px" class="font-bold">OpenMind</p>
    </div>
  </div>

  <DefaultOgImage v-else />
</template>

<script setup lang="ts">
import DefaultOgImage from "./DefaultOgImage.vue";

withDefaults(
  defineProps<{
    user?: UserFull;
  }>(),
  {
    user: undefined,
  },
);
</script>
