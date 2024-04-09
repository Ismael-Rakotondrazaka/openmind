<template>
  <ul>
    <li v-for="tag in tags" :key="tag.id" class="inline mr-3 last:mr-0">
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
