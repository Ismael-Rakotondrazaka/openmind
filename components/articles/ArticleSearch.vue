<template>
  <form action="" method="post" class="" @submit.prevent="onSearchHandler">
    <PrimeInputGroup class="mb-3">
      <PrimeInputText v-model="titleSearch" placeholder="Search by title" />
      <PrimeButton icon="pi pi-search" type="submit" />
    </PrimeInputGroup>

    <div class="flex w-full items-start gap-3">
      <div class="w-1/3">
        <InputLabel label-for="Type" label="Type" :is-required="false" />

        <PrimeDropdown
          v-model="selectedOption"
          :options="selectOptions"
          option-label="text"
          class="w-full"
        />
      </div>

      <TagInput
        v-model:tags="tags"
        :consider-new-tag="false"
        :is-required="false"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Prisma } from "@prisma/client";

const titleSearch = ref<string | null>();

const tags = ref<Tag[]>([]);

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
  tags: Tag[],
): Prisma.ArticleWhereInput => {
  return {
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
    tags:
      tags.length > 0
        ? {
            some: {
              id: {
                in: tags.map((tag: Tag) => tag.id),
              },
            },
          }
        : undefined,
  };
};

const onSearchHandler = () => {
  emit(
    "where:update",
    computeWhereNewValue(
      authUser.value?.id,
      selectedOption.value.key,
      tags.value,
    ),
  );
};

watch(
  [() => authUser.value?.id, () => selectedOption.value.key, tags],
  ([authUserId, selectedOptionKey, tags]) => {
    emit(
      "where:update",
      computeWhereNewValue(authUserId, selectedOptionKey, tags),
    );
  },
);
</script>
