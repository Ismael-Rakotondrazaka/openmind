<template>
  <p v-if="haveDescription" class="text-[--text-color]">
    {{ description }}
  </p>
</template>

<script lang="ts" setup>
interface InputDescriptionProps {
  description?: string;
}

const props = defineProps<InputDescriptionProps>();

const haveDescription = computed<boolean>(
  () => props.description !== undefined,
);
</script>
