<template>
  <div>
    <InputLabel
      label-for="content"
      label="Content"
      :is-required="true"
      :tooltip-text="tooltipText"
    />

    <InputDescription
      description="Pour your ideas, insights, and expertise into engaging and informative prose to captivate your audience."
    />

    <PrimeEditor id="content" v-model="content" editor-style="height: 320px" />

    <small id="email-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const content = defineModel<string, string>("content");

defineProps({
  errorMessage: {
    type: String,
    required: false,
    default: undefined,
  },
});

const contentMaxLengthFormatted = useNumericAbbreviation(
  articleConfig.CONTENT_MAX_LENGTH,
);

const tooltipText = computed<string>(() =>
  [
    `• ${articleConfig.CONTENT_MIN_LENGTH} characters min`,
    `• ${contentMaxLengthFormatted.value} characters max`,
  ].join("\n"),
);
</script>
