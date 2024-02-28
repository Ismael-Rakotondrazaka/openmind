<template>
  <ReactionLikeIcon v-if="type === 'like'" :size="size" />
  <ReactionLoveIcon v-else-if="type === 'love'" :size="size" />
  <ReactionCelebrateIcon v-else :size="size" />
</template>

<script lang="ts" setup>
interface ReactionIconProps {
  size?: "small" | "normal" | "large" | "xlarge";
  type: ReactionType;
}

defineProps<ReactionIconProps>();
</script>
