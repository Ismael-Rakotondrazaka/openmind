<template>
  <div class="flex gap-2 flex-col w-full">
    <label for="summary">Summary</label>

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
</script>
