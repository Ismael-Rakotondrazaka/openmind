<template>
  <div
    v-if="user !== undefined"
    class="w-full h-full flex flex-col justify-between items-center relative bg-white text-gray-900 p-10"
  >
    <div class="w-full flex flex-col justify-center items-center">
      <img
        v-if="user.profileUrl !== null"
        class="mr-3 rounded-full w-64 h-64 object-cover"
        :src="user.profileUrl"
        :alt="`${user.firstName} ${user.name}`"
      />
      <p v-else class="rounded-full w-64 h-64 object-cover">
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

    <div class="flex flex-row justify-center items-center text-left w-full">
      <img src="/images/logo.svg" alt="Logo" class="w-16 h-16 mr-5" />

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
