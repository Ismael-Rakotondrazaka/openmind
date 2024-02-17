<template>
  <div class="flex gap-2 flex-col w-full">
    <InputLabel
      label="Summary"
      label-for="summary"
      :tooltip-text="tooltipText"
    />

    <InputDescription
      description="Provide a brief overview of your article to entice readers and give them a preview of what to expect."
    />

    <PrimeInputText
      id="summary"
      v-model="summary"
      :class="{ 'p-invalid': haveError }"
    />

    <small id="email-or-isVisible-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script setup lang="ts">
const summary = defineModel<string | null, string>("summary");

const props = defineProps({
  errorMessage: {
    type: String,
    required: false,
    default: undefined,
  },
});

const haveError = computed<boolean>(() => props.errorMessage !== undefined);

const tooltipText = computed<string>(() =>
  [
    `• ${articleConfig.SUMMARY_MIN_LENGTH} characters min`,
    `• ${articleConfig.SUMMARY_MAX_LENGTH} characters max`,
  ].join("\n"),
);
</script>
