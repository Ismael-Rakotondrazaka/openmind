<template>
  <div>
    <label
      :for="labelFor"
      class="text-[--text-color] font-bold inline-block mr-2"
      >{{ label }}
      <span v-if="isRequired" class="text-[#e24c4c]">*</span></label
    >

    <i
      v-if="haveTooltip"
      v-tooltip="tooltipText"
      class="pi pi-question-circle text-base inline-block"
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
