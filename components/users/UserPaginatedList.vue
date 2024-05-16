<template>
  <div>
    <NoResult v-if="users == null || users.length === 0" />
    <UserList v-else :users="users" @users:update="onUsersUpdateHandler" />

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
import { useIndexUser } from "~/composables";

/* ---------------------------------- Props --------------------------------- */
type UserPaginatedList = {
  page?: number;
  pageSize?: number;
  where?: IndexUserQuery["where"];
  orderBy?: IndexUserQuery["orderBy"];
};

const props = withDefaults(defineProps<UserPaginatedList>(), {
  page: 1,
  pageSize: userConfig.PAGE_SIZE_DEFAULT_VALUE,
  where: undefined,
  orderBy: undefined,
});
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Emits --------------------------------- */
type UserTabContentEmits = {
  "totals-count:update": [number];
  "page:update": [number];
  "page-size:update": [number];
};

const emit = defineEmits<UserTabContentEmits>();
/* -------------------------------------------------------------------------- */

const query = computed<IndexUserQuery>(() => {
  return {
    where: props.where,
    page: props.page,
    pageSize: props.pageSize,
    orderBy: props.orderBy,
  };
});

const { users, pagination } = useIndexUser({
  query,
  immediate: true,
});

const { update } = useMutateUserList(users);
const onUsersUpdateHandler = (
  id: number,
  data: UseMutateUserListUpdateData,
) => {
  update(id, data);
};

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
    result.push((i + 1) * userConfig.PAGE_SIZE_DEFAULT_VALUE);
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
