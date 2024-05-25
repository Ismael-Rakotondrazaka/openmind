<template>
  <ul v-auto-animate>
    <li
      v-for="tag in tags"
      :key="tag.id"
      class="mb-2 mr-2 inline-block last:mr-0"
    >
      <PrimeChip :label="tag.value" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { type Tag } from "@prisma/client";

type TagListProps = {
  tags: Tag[];
};

defineProps<TagListProps>();
</script>
