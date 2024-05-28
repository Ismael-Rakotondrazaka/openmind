<template>
  <div>
    <NoResult v-if="articles == null || articles.length === 0" />
    <ArticleList v-else :articles="articles" />

    <PrimePaginator
      v-if="pagination !== null"
      :rows="pagination.pageSize"
      :total-records="pagination.totalCounts"
      class="mb-10"
      :rows-per-page-options="rowsPerPageOptions"
      @page="onPageChangeHandler"
    ></PrimePaginator>
  </div>
</template>

<script lang="ts" setup>
import type { PageState } from "primevue/paginator";

/* ---------------------------------- Props --------------------------------- */
type ArticlePaginatedListProps = {
  page?: number;
  pageSize?: number;
  where?: IndexArticleQuery["where"];
  orderBy?: IndexArticleQuery["orderBy"];
};

const props = withDefaults(defineProps<ArticlePaginatedListProps>(), {
  page: 1,
  pageSize: articleConfig.PAGE_SIZE_DEFAULT_VALUE,
  where: undefined,
  orderBy: undefined,
});
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Emits --------------------------------- */
type ArticleTabContentEmits = {
  "totals-count:update": [number];
  "page:update": [number];
  "page-size:update": [number];
};

const emit = defineEmits<ArticleTabContentEmits>();
/* -------------------------------------------------------------------------- */

const query = computed<IndexArticleQuery>(() => {
  return {
    where: props.where,
    page: props.page,
    pageSize: props.pageSize,
    orderBy: props.orderBy,
  };
});

const { articles, pagination } = useIndexArticle({
  query,
  immediate: true,
});

watchImmediate(pagination, (newValue) => {
  if (newValue === null) {
    emit("totals-count:update", 0);
  } else {
    emit("totals-count:update", newValue.totalCounts);
  }
});

const rowsPerPageOptions: ComputedRef<number[]> = computed(() => {
  const size: number = 4;
  const result: number[] = [];

  for (let i = 0; i < size; i++) {
    result.push((i + 1) * articleConfig.PAGE_SIZE_DEFAULT_VALUE);
  }

  return result;
});

const onPageChangeHandler = (event: PageState) => {
  if (props.page !== event.page + 1) {
    emit("page:update", event.page + 1);
  }

  if (props.pageSize !== event.rows) {
    emit("page-size:update", event.rows);
  }
};
</script>
