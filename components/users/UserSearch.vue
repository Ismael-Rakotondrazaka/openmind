<template>
  <form
    action=""
    method="post"
    class="flex items-end gap-3"
    @submit.prevent="onSearchHandler"
  >
    <PrimeInputGroup>
      <PrimeInputText
        v-model="nameSearch"
        placeholder="Search by name or username"
      />

      <PrimeButton icon="pi pi-search" type="submit" />
    </PrimeInputGroup>

    <div class="w-full md:w-1/3">
      <p class="text-text-secondary mb-1">Order by:</p>

      <PrimeDropdown
        v-model="selectedOrderOption"
        :options="selectOrderOptions"
        option-label="text"
        class=""
      >
        <template #dropdownicon>
          <i class="pi pi-sort"></i>
        </template>
      </PrimeDropdown>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Prisma } from "@prisma/client";

const nameSearch = ref<string>("");

type UserSearchEmits = {
  "where:update": [Prisma.UserWhereInput];
  "order-by:update": [
    Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[],
  ];
};

const emit = defineEmits<UserSearchEmits>();

type SelectedOrderOptionKey = "FIRST_NAME" | "FOLLOWERS" | "ARTICLES";
type SelectOrderOption = {
  text: string;
  key: SelectedOrderOptionKey;
};

const orderOptions: Record<SelectedOrderOptionKey, SelectOrderOption> = {
  FIRST_NAME: {
    text: "Name",
    key: "FIRST_NAME",
  },
  FOLLOWERS: {
    text: "Followers",
    key: "FOLLOWERS",
  },
  ARTICLES: {
    text: "Articles",
    key: "ARTICLES",
  },
};

const selectOrderOptions: Ref<SelectOrderOption[]> = ref([
  orderOptions.FIRST_NAME,
  orderOptions.FOLLOWERS,
  orderOptions.ARTICLES,
]);

const selectedOrderOption = ref<SelectOrderOption>(orderOptions.FIRST_NAME);

const computeWhereNewValue = (): Prisma.UserWhereInput => {
  /* eslint-disable indent */
  return nameSearch.value === ""
    ? {}
    : {
        OR: [
          {
            firstName: {
              contains: nameSearch.value,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: nameSearch.value,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: nameSearch.value,
              mode: "insensitive",
            },
          },
        ],
      };
  /* eslint-enable indent */
};

/* eslint-disable indent */
const computeOrderNewValue = (
  selectedOptionValue: SelectOrderOption,
):
  | Prisma.UserOrderByWithRelationInput
  | Prisma.UserOrderByWithRelationInput[] => {
  switch (selectedOptionValue.key) {
    case orderOptions.ARTICLES.key:
      return [
        {
          articles: {
            _count: "desc",
          },
        },
      ];

    case orderOptions.FIRST_NAME.key:
      return [
        {
          firstName: "asc",
        },
        {
          name: "asc",
        },
      ];

    case orderOptions.FOLLOWERS.key:
      return {
        followers: {
          _count: "desc",
        },
      };
  }

  return {};
};
/* eslint-enable indent */

const onSearchHandler = () => {
  emit("where:update", computeWhereNewValue());
};

watch(
  selectedOrderOption,
  (newValue) => {
    emit("order-by:update", computeOrderNewValue(newValue));
  },
  {
    immediate: true,
  },
);
</script>
