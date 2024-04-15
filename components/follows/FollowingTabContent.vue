<template>
  <UserSearch class="mb-5" @where:update="onWhereUpdateHandler" />

  <UserPaginatedList
    :page="page"
    :page-size="pageSize"
    :order-by="orderBy"
    :where="where"
    @page-size:update="onPageSizeUpdatedHandler"
    @page:update="onPageUpdatedHandler"
  />
</template>

<script setup lang="ts">
import type { Prisma } from "@prisma/client";

type FollowerTabContentProps = {
  userId: number;
};

const props = defineProps<FollowerTabContentProps>();

const page = ref<number>(1);

const pageSize = ref<number>(userConfig.PAGE_SIZE_DEFAULT_VALUE);

const orderBy = ref<IndexUserQuery["orderBy"]>({});

const where = ref<Exclude<IndexUserQuery["where"], undefined>>({
  followers: {
    some: {
      followerId: props.userId,
    },
  },
});

watch(
  () => props.userId,
  (newValue) => {
    where.value = {
      ...where.value,
      followers: {
        some: {
          followerId: newValue,
        },
      },
    };
  },
);

const onPageSizeUpdatedHandler = (newValue: number) => {
  pageSize.value = newValue;
};

const onPageUpdatedHandler = (newValue: number) => {
  page.value = newValue;
};

const onWhereUpdateHandler = (newValue: Prisma.UserWhereInput) => {
  where.value = {
    ...newValue,
    followers: {
      some: {
        followerId: props.userId,
      },
    },
  };
};
</script>
