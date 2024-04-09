<template>
  <div
    class="flex flex-col items-center p-5 bg-[--surface-0] rounded-md w-full"
  >
    <div
      :class="[bgClass]"
      class="rounded-full text-white shadow-md inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-16"
    >
      <i class="text-5xl pi pi-question"></i>
    </div>
    <span class="block mt-4 mb-2 text-2xl font-bold text-text">{{
      content
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { Severity } from "~/utils";

interface IConfirmDialogHeaderProps {
  content: string;
  severity?: Severity;
}

const props = withDefaults(defineProps<IConfirmDialogHeaderProps>(), {
  severity: "primary",
});

const severityBgClass: Record<Severity, string> = {
  primary: "bg-primary",
  info: "bg-info",
  danger: "bg-danger",
  success: "bg-success",
  warning: "bg-warning",
  contrast: "bg-contrast",
  secondary: "bg-secondary",
};

const bgClass = computed(() => severityBgClass[props.severity]);
</script>
