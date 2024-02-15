<template>
  <div>
    <label for="email">Content</label>

    <PrimeEditor v-model="content" editor-style="height: 320px" />

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
</script>
