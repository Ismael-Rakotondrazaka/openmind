<template>
  <ul class="space-y-2">
    <li v-for="i in count" :key="i">
      <ReactionListItemSkeleton />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import ReactionListItemSkeleton from './ReactionListItemSkeleton.vue';

interface Props {
  count?: number;
}

withDefaults(defineProps<Props>(), {
  count: 5,
});
</script>
