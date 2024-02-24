<template>
  <PrimeButton
    severity="secondary"
    icon="pi pi-eye"
    text
    :label="formattedCount"
  />
</template>

<script lang="ts" setup>
interface ViewsCountDisplayerProps {
  count: number;
}

const props = defineProps<ViewsCountDisplayerProps>();

const formattedCount = useNumericAbbreviation(props.count);
</script>
