<template>
  <PrimeButton
    icon="pi pi-comment"
    severity="secondary"
    :label="formattedCount"
    text
  />
</template>

<script lang="ts" setup>
const count = defineModel<number>("count", {
  required: true,
});

const formattedCount = useNumericAbbreviation(count);
</script>
