<template>
  <form action="" method="post" class="" @submit.prevent="onSearchHandler">
    <PrimeInputGroup class="mb-3">
      <PrimeInputText v-model="titleSearch" placeholder="Search by title" />
      <PrimeButton icon="pi pi-search" type="submit" />
    </PrimeInputGroup>

    <div class="flex w-full items-start gap-3">
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

type SavedArticleSearchEmits = {
  "where:update": [Prisma.SavedArticleWhereInput];
};

const emit = defineEmits<SavedArticleSearchEmits>();

const { user: authUser } = useAuthUser();

const computeWhereNewValue = (
  authUserId: number | undefined,
  tags: Tag[],
): Prisma.SavedArticleWhereInput => {
  return {
    article: {
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
    },
  };
};

const onSearchHandler = () => {
  emit("where:update", computeWhereNewValue(authUser.value?.id, tags.value));
};

watch([() => authUser.value?.id, tags], ([authUserId, tags]) => {
  emit("where:update", computeWhereNewValue(authUserId, tags));
});
</script>
