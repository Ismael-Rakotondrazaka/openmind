<template>
  <pre>
    {{ article }}

    {{ showArticleError }}
  </pre>
</template>

<script setup lang="ts">
import { H3Error } from "h3";
const route = useRoute("articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const {
  data: article,
  error: showArticleRawError,
}: {
  data: Ref<ShowArticleData["article"] | null>;
  error: Ref<H3Error<ShowArticleError> | null>;
} = await useFetch(() => `/api/articles/${slug.value}`, {
  transform: (value) => ShowArticleDataSchema.parse(value).article,
});

const showArticleError: ComputedRef<ShowArticleError | null> = computed(() => {
  let result: ShowArticleError | null = null;

  if (
    showArticleRawError.value !== null &&
    showArticleRawError.value.data !== undefined
  ) {
    result = showArticleRawError.value.data;
  }

  return result;
});
</script>
