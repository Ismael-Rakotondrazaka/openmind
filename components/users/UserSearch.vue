<template>
  <form
    action=""
    method="post"
    class="flex gap-3"
    @submit.prevent="onSearchHandler"
  >
    <PrimeInputGroup>
      <PrimeInputText
        v-model="nameSearch"
        placeholder="Search by name or username"
      />

      <PrimeButton icon="pi pi-search" type="submit" />
    </PrimeInputGroup>
  </form>
</template>

<script setup lang="ts">
import type { Prisma } from "@prisma/client";

const nameSearch = ref<string>("");

type UserSearchEmits = {
  "where:update": [Prisma.UserWhereInput];
};

const emit = defineEmits<UserSearchEmits>();

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

const onSearchHandler = () => {
  emit("where:update", computeWhereNewValue());
};
</script>
