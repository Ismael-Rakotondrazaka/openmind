<template>
  <div
    v-if="article !== undefined"
    class="w-full h-full flex justify-between relative bg-white text-gray-900"
  >
    <div class="h-full w-full justify-between relative">
      <div class="flex flex-row h-full justify-between items-start">
        <div
          class="flex flex-col justify-between w-full h-full p-10"
          :class="{
            'max-w-[65%]': article.coverUrl !== null,
          }"
        >
          <address
            class="flex items-center mr-3 text-sm text-gray-900 dark:text-white mb-6 not-italic"
          >
            <img
              v-if="article.user.profileUrl !== null"
              class="mr-3 rounded-full w-24 h-24 object-cover"
              :src="article.user.profileUrl"
              :alt="`${article.user.firstName} ${article.user.name}`"
            />
            <p v-else class="rounded-full w-32 h-32 object-cover">
              {{ article.user.firstName[0] }}
            </p>

            <div
              class="flex flex-col items-center gap-1"
              :style="{
                alignItems: 'center',
              }"
            >
              <p class="text-2xl font-bold text-text">
                {{ `${article.user.firstName} ${article.user.name}` }}
              </p>
              <p class="text-2xl text-gray-500">
                {{ article.user.username }}
              </p>
            </div>
          </address>

          <div class="">
            <h1 class="m-0 font-bold mb-[30px] text-5xl">
              {{ article.title }}
            </h1>
            <p v-if="article.summary" class="text-3xl text-text">
              {{ article.summary }}
            </p>
          </div>

          <div
            class="flex self-end flex-row justify-center items-center text-left w-full"
          >
            <img src="/images/logo.svg" alt="Logo" class="w-16 h-16 mr-5" />

            <p style="font-size: 25px" class="font-bold">OpenMind</p>
          </div>
        </div>

        <div
          v-if="article.coverUrl !== null"
          style="width: 30%"
          class="flex justify-end h-full"
        >
          <img
            class="w-full h-full object-cover"
            :src="article.coverUrl"
            :alt="article.title"
          />
        </div>
      </div>
    </div>
  </div>

  <DefaultOgImage v-else />
</template>

<script setup lang="ts">
import DefaultOgImage from "./DefaultOgImage.vue";

withDefaults(
  defineProps<{
    article?: ArticleFull;
  }>(),
  {
    article: undefined,
  },
);
</script>
