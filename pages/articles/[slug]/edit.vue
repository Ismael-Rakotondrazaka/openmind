<template>
  <div class="flex items-center justify-center min-h-screen p-5">
    <EditArticleForm v-if="article !== null" :article="article" />
  </div>
</template>

<script setup lang="ts">
import type { H3Error } from "h3";
import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";

definePageMeta({
  middleware: "auth",
});

const route = useRoute("users-username-articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const {
  data: article,
}: {
  data: Ref<ShowArticleData["article"] | null>;
  error: Ref<H3Error<ShowArticleError> | null>;
  execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
} = await useFetch(() => `/api/articles/${slug.value}`, {
  transform: (value) => ShowArticleDataSchema.parse(value).article,
});
</script>
