<template>
  <ul>
    <li
      v-for="reaction in reactions"
      :key="reaction.id"
      class="mb-3 last-of-type:mb-0"
    >
      <ReactionItem :reaction="reaction" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
interface ReactionListProps {
  reactions: ReactionFull[];
}

defineProps<ReactionListProps>();
</script>
