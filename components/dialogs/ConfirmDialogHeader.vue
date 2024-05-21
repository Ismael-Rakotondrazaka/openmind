<template>
  <div class="flex flex-col items-start bg-[--surface-0] rounded-md w-full">
    <div
      :class="[bgClass]"
      class="self-center rounded-full text-white shadow-md inline-flex justify-center items-center h-[6rem] w-[6rem] -mt-16"
    >
      <i class="text-5xl" :class="[iconClass]"></i>
    </div>
    <span
      class="self-center text-center block whitespace-pre-wrap mt-4 mb-2 text-2xl font-bold text-text"
      >{{ content }}</span
    >
  </div>
</template>

<script lang="ts" setup>
import type { Severity } from "~/utils";

type IconType = "question" | "check" | "info";

interface IConfirmDialogHeaderProps {
  content: string;
  severity?: Severity;
  iconType?: IconType;
}

const props = withDefaults(defineProps<IConfirmDialogHeaderProps>(), {
  severity: "primary",
  iconType: "question",
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

const severityIconClass: Record<IconType, string> = {
  check: "pi pi-check",
  info: "pi pi-info",
  question: "pi pi-question",
};

const iconClass = computed(() => severityIconClass[props.iconType]);
</script>
