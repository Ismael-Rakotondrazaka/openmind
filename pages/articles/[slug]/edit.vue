<template>
  <EditArticleForm
    v-if="article !== null"
    :article="article"
    class="mx-auto w-full max-w-[700px]"
  />
  <NotFoundPage v-else />
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { AsyncData } from "#app/composables/asyncData";

defineOgImageComponent("DefaultOgImage");

definePageMeta({
  middleware: "auth",
});

const route = useRoute("users-username-articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const {
  data: article,
}: AsyncData<
  ShowArticleData["article"] | null,
  FetchError<ShowArticleError> | null
> = useFetch(() => `/api/articles/${slug.value}`, {
  method: "GET",
  transform: (
    value: ShowArticleData | null,
  ): ShowArticleData["article"] | null =>
    value === null ? null : ShowArticleDataSchema.parse(value).article,
});
</script>
