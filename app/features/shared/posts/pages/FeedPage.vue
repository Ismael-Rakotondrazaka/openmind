<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175">
    <h1 class="mb-4 text-2xl font-bold">Feed</h1>
    <ul class="">
      <li
        v-for="post in posts"
        :key="post.id"
        class="border-b pt-4 pb-4 first:pt-0 last:border-b-0"
      >
        <PostCard :post="post" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import PostCard from '../components/PostCard.vue';
import { useGetPosts } from '../composables/useGetPosts';

const { data } = useGetPosts();

const posts = computed(() => data.value?.data ?? []);
</script>

<style scoped></style>
