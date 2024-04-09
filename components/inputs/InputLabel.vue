<template>
  <div>
    <label
      :for="labelFor"
      class="text-[--text-color] font-bold inline-block mr-2"
      >{{ label }} <span v-if="isRequired" class="text-danger">*</span></label
    >

    <i
      v-if="haveTooltip"
      v-tooltip="tooltipText"
      class="inline-block text-base pi pi-question-circle"
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
