<template>
  <div>
    <InputLabel
      label-for="title"
      label="Title"
      :is-required="true"
      :tooltip-text="tooltipText"
    />

    <InputDescription
      description="Craft a captivating headline that summarizes the essence of your article and sparks curiosity."
    />

    <PrimeInputText
      id="title"
      v-model="title"
      :class="{ 'p-invalid': haveError }"
    />

    <small id="email-or-isVisible-text-error" class="text-red-600">{{
      errorMessage || "&nbsp;"
    }}</small>
  </div>
</template>

<script lang="ts" setup>
const title = defineModel<string, string>("title");

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
    `• ${articleConfig.TITLE_MIN_LENGTH} characters min`,
    `• ${articleConfig.TITLE_MAX_LENGTH} characters max`,
  ].join("\n"),
);
</script>
