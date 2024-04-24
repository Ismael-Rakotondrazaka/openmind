<template>
  <form
    action=""
    method="post"
    class="flex gap-3"
    @submit.prevent="onSearchHandler"
  >
    <PrimeInputGroup>
      <PrimeInputText v-model="titleSearch" placeholder="Search by title" />
      <PrimeButton icon="pi pi-search" type="submit" />
    </PrimeInputGroup>

    <PrimeDropdown
      v-model="selectedOption"
      :options="selectOptions"
      option-label="text"
      class="w-full md:w-1/3"
    />
  </form>
</template>

<script setup lang="ts">
import type { Prisma } from "@prisma/client";

const titleSearch = ref<string | null>();

type SelectedOptionKey = "ALL" | "VIEWED";
type SelectOption = {
  text: string;
  key: SelectedOptionKey;
};

const options: Record<SelectedOptionKey, SelectOption> = {
  ALL: {
    text: "All",
    key: "ALL",
  },
  VIEWED: {
    text: "Viewed",
    key: "VIEWED",
  },
};

const selectOptions = computed<SelectOption[]>(() => {
  const result: SelectOption[] = [options.ALL];

  if (authUser.value !== null) {
    result.push(options.VIEWED);
  }

  return result;
});

const selectedOption = ref<SelectOption>(options.ALL);

type ArticleSearchEmits = {
  "where:update": [Prisma.ArticleWhereInput];
};

const emit = defineEmits<ArticleSearchEmits>();

const { user: authUser } = useAuthUser();

const computeWhereNewValue = (
  authUserId: number | undefined,
  selectedOptionKey: SelectedOptionKey,
): Prisma.ArticleWhereInput => {
  return {
    /* eslint-disable indent */
    views:
      authUserId !== undefined && selectedOptionKey === "VIEWED"
        ? {
            some: {
              userId: authUserId,
            },
          }
        : undefined,
    title:
      typeof titleSearch.value === "string"
        ? {
            contains: titleSearch.value,
            mode: "insensitive",
          }
        : undefined,
    /* eslint-enable indent */
  };
};

const onSearchHandler = () => {
  emit(
    "where:update",
    computeWhereNewValue(authUser.value?.id, selectedOption.value.key),
  );
};

watch(
  [() => authUser.value?.id, () => selectedOption.value.key],
  ([authUserId, selectedOptionKey]) => {
    emit("where:update", computeWhereNewValue(authUserId, selectedOptionKey));
  },
);
</script>
