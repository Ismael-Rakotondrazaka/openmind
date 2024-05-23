<template>
  <div
    v-if="article !== undefined"
    class="relative flex h-full w-full justify-between bg-white text-gray-900"
  >
    <div class="relative h-full w-full justify-between">
      <div class="flex h-full flex-row items-start justify-between">
        <div
          class="flex h-full w-full flex-col justify-between p-10"
          :class="{
            'max-w-[65%]': article.coverUrl !== null,
          }"
        >
          <address
            class="mb-6 mr-3 flex items-center text-sm not-italic text-gray-900 dark:text-white"
          >
            <img
              v-if="article.user.profileUrl !== null"
              class="mr-3 h-24 w-24 rounded-full object-cover"
              :src="article.user.profileUrl"
              :alt="`${article.user.firstName} ${article.user.name}`"
            />
            <p v-else class="h-32 w-32 rounded-full object-cover">
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
            <h1 class="m-0 mb-[30px] text-5xl font-bold">
              {{ article.title }}
            </h1>
            <p v-if="article.summary" class="text-3xl text-text">
              {{ article.summary }}
            </p>
          </div>

          <div
            class="flex w-full flex-row items-center justify-center self-end text-left"
          >
            <img src="/images/logo.svg" alt="Logo" class="mr-5 h-16 w-16" />

            <p style="font-size: 25px" class="font-bold">OpenMind</p>
          </div>
        </div>

        <div
          v-if="article.coverUrl !== null"
          style="width: 30%"
          class="flex h-full justify-end"
        >
          <img
            class="h-full w-full object-cover"
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
