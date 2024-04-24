<template>
  <ul>
    <li
      v-for="tag in tags"
      :key="tag.id"
      class="inline-block mr-2 mb-2 last:mr-0"
    >
      <PrimeChip :label="tag.value" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
type TagListProps = {
  tags: Tag[];
};

defineProps<TagListProps>();
</script>
