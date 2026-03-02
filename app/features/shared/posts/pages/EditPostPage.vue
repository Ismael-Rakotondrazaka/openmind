<script lang="ts" setup>
import EditPostForm from '../components/EditPostForm.vue';
import { useGetPost } from '../composables/useGetPost';

const route = useRoute('posts-postId-edit');
const postId = computed(() => route.params.postId);

const { data: post, isError, isLoading } = useGetPost(postId);
</script>

<template>
  <div class="mx-auto mt-15 min-h-svh w-full max-w-175 px-2">
    <div v-if="isLoading" class="text-muted-foreground py-12 text-center">
      Loading post...
    </div>
    <div v-else-if="isError || !post" class="py-12 text-center text-red-500">
      Post not found.
    </div>
    <EditPostForm v-else :post="post" />
  </div>
</template>

<style></style>
