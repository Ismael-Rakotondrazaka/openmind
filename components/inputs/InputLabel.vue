<template>
  <div>
    <label :for="labelFor" class="mr-2 inline-block font-bold text-text"
      >{{ label }} <span v-if="isRequired" class="text-danger">*</span></label
    >

    <i
      v-if="haveTooltip"
      v-tooltip="tooltipText"
      class="pi pi-question-circle inline-block text-base"
    />
  </div>
</template>

<script lang="ts" setup>
interface InputLabelProps {
  labelFor: string;
  label: string;
  tooltipText?: string;
  isRequired?: boolean;
}

const props = withDefaults(defineProps<InputLabelProps>(), {
  isRequired: false,
  tooltipText: undefined,
});

const haveTooltip = computed<boolean>(() => props.tooltipText !== undefined);
</script>
