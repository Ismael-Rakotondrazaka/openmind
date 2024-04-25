<template>
  <ArticleSearch class="mb-5" @where:update="onWhereUpdateHandler" />

  <ArticlePaginatedList
    :page="page"
    :page-size="pageSize"
    :order-by="orderBy"
    :where="where"
    @page-size:update="onPageSizeUpdatedHandler"
    @page:update="onPageUpdatedHandler"
  />
</template>

<script lang="ts" setup>
import type { Prisma } from "@prisma/client";

const page = ref<number>(1);

const pageSize = ref<number>(articleConfig.PAGE_SIZE_DEFAULT_VALUE);

const orderBy = ref<IndexArticleQuery["orderBy"]>({
  createdAt: "desc",
});

const where = ref<Exclude<IndexArticleQuery["where"], undefined>>({});

const onPageSizeUpdatedHandler = (newValue: number) => {
  pageSize.value = newValue;
};

const onPageUpdatedHandler = (newValue: number) => {
  page.value = newValue;
};

const onWhereUpdateHandler = (newValue: Prisma.ArticleWhereInput) => {
  where.value = {
    ...where.value,
    ...newValue,
  };
};
</script>

<style></style>
