<template>
  <TagInput
    v-model:tags="tags"
    :error-message="errorMessage"
    :tooltip-text="tooltipText"
    description="Add descriptive keywords to categorize your article and improve discoverability."
  />
</template>

<script lang="ts" setup>
interface ArticleTagInputProps {
  errorMessage?: string;
}

const tags = defineModel<Tag[], string>({
  default: () => [],
});

defineProps<ArticleTagInputProps>();

const tooltipText = computed<string>(() =>
  [
    `• ${tagConfig.VALUE_MAX_LENGTH} characters max`,
    "• 1 min",
    `• ${articleConfig.TAGS_MAX_SIZE} max`,
  ].join("\n"),
);
</script>
