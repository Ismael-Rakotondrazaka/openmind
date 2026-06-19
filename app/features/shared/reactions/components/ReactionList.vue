<template>
  <ul class="space-y-2">
    <li v-for="reaction in reactions" :key="reaction.id">
      <ReactionListItem :reaction="reaction" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { ReactionWithUser } from '#shared/features/reactions';

import ReactionListItem from './ReactionListItem.vue';

interface props {
  reactions: Serialize<ReactionWithUser>[];
}

const props = defineProps<props>();
</script>

<style></style>
