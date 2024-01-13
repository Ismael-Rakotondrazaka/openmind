<template>
  <div>
    <div class="w-screen max-w-[680px] mx-auto">
      <ul class="flex flex-wrap items-stretch justify-evenly, w-full gap-5">
        <li v-for="article in articles" :key="article.id" class="w-full">
          <div class="md:flex rounded-xl dark:bg-slate-800">
            <NuxtLink
              :to="{
                name: 'articles-slug',
                params: { slug: article.slug },
              }"
              class="w-60 max-h-[12rem], block shrink-0 bg-[--surface-200]"
            >
              <NuxtImg
                v-if="article.coverUrl !== null"
                :src="article.coverUrl"
                class="w-60 h-full object-cover"
                width="240"
                height="192"
              />

              <div
                v-else
                class="w-60 h-full object-cover"
                width="240"
                height="192"
              />
            </NuxtLink>
            <div class="p-3 text-left flex flex-col w-full justify-between">
              <div>
                <div class="flex items-center justify-start mb-2">
                  <PrimeAvatar
                    v-if="article.user.profileUrl !== null"
                    :image="article.user.profileUrl"
                    class="mr-2"
                    shape="circle"
                  />
                  <PrimeAvatar
                    v-else
                    icon="pi pi-user"
                    class="mr-2"
                    shape="circle"
                  />
                  <div class="text-sm">
                    {{ article.user.firstName }}&nbsp;{{
                      article.user.firstName
                    }}
                  </div>
                </div>

                <h2 class="font-bold text-xl text-slate-900 line-clamp-2">
                  <NuxtLink
                    :to="{
                      name: 'articles-slug',
                      params: { slug: article.slug },
                    }"
                    >{{ article.title }}</NuxtLink
                  >
                </h2>

                <p class="text-ellipsis text-gray-600 mb-2 line-clamp-2">
                  {{ article.summary ?? "&nbsp;" }}
                </p>
              </div>

              <p class="text-sm text-gray-600">
                {{ dayjs(article.createdAt).fromNow() }} ·
                <PrimeChip label="lorem"></PrimeChip>
              </p>
            </div>
          </div>
        </li>
      </ul>

      <PrimePaginator
        :rows="pagination.pageSize"
        :total-records="pagination.totalCounts"
        class="mb-10"
        :rows-per-page-options="rowsPerPageOptions"
        @page="onPageChangeHandler"
      ></PrimePaginator>
    </div>

    <PrimeScrollTop />
  </div>
</template>

<script setup lang="ts">
import { H3Error } from "h3";
import type { PageState } from "primevue/paginator";
import { parseNestedJSON } from "~/utils";

const route = useRoute("articles");

const query: ComputedRef<IndexArticleQuery> = computed(() => {
  const query = route.query;

  const nestedParsed: Record<string, unknown> = parseNestedJSON(query);

  return IndexArticleQuerySchema.parse(nestedParsed);
});

const {
  data: showArticleData,
}: {
  data: Ref<IndexArticleData | null>;
  error: Ref<H3Error<IndexArticleError> | null>;
} = await useFetch(() => "/api/articles", {
  transform: (value) => IndexArticleDataSchema.parse(value),
  query,
});

const rowsPerPageOptions: ComputedRef<number[]> = computed(() => {
  const size: number = 4;
  const result: number[] = [];

  for (let i = 0; i < size; i++) {
    result.push((i + 1) * articleConfig.PAGE_SIZE_DEFAULT_VALUE);
  }

  return result;
});

const dayjs = useDayjs();

const articles: ComputedRef<IndexArticleData["articles"]> = computed(() => {
  let result: IndexArticleData["articles"] = [];

  if (showArticleData.value !== null) {
    result = showArticleData.value.articles;
  }

  return result;
});

const pagination: ComputedRef<Pagination> = computed(() => {
  if (showArticleData.value !== null) {
    return PaginationSchema.parse(showArticleData.value);
  } else {
    return {
      page: 1,
      pageSize: articleConfig.PAGE_SIZE_DEFAULT_VALUE,
      count: 0,
      totalCounts: 0,
      totalPages: 1,
      links: {
        current: "",
        previous: null,
        next: null,
      },
    };
  }
});

const JSONStringifyNested = (
  object: Record<string, unknown>,
): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = JSON.stringify(object[key]);
    }
  }

  return result;
};

const onPageChangeHandler = (event: PageState) => {
  if (query.value.page !== event.page + 1) {
    navigateTo({
      name: "articles",
      query: {
        ...JSONStringifyNested(query.value),
        page: event.page + 1,
      },
    });
  } else if (query.value.pageSize !== event.rows) {
    navigateTo({
      name: "articles",
      query: {
        ...JSONStringifyNested(query.value),
        pageSize: event.rows,
      },
    });
  }
};
</script>
