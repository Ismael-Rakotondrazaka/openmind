<template>
  <SavedArticleSearch class="mb-5" @where:update="onWhereUpdateHandler" />

  <SavedArticlePaginatedList
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

const orderBy = ref<IndexSavedArticleQuery["orderBy"]>({
  createdAt: "desc",
});

const { user: authUser } = useAuthUser();

const where = ref<Exclude<IndexSavedArticleQuery["where"], undefined>>({
  userId: authUser.value!.id,
  article: {
    deletedAt: null,
  },
});

const onPageSizeUpdatedHandler = (newValue: number) => {
  pageSize.value = newValue;
};

const onPageUpdatedHandler = (newValue: number) => {
  page.value = newValue;
};

const onWhereUpdateHandler = (newValue: Prisma.SavedArticleWhereInput) => {
  where.value = {
    ...where.value,
    ...newValue,
  };
};
</script>

<style></style>
