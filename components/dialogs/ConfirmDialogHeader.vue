<template>
  <div class="flex w-full flex-col items-start rounded-md bg-[--surface-0]">
    <div
      :class="[bgClass]"
      class="-mt-16 inline-flex h-[6rem] w-[6rem] items-center justify-center self-center rounded-full text-white shadow-md"
    >
      <i class="text-5xl" :class="[iconClass]"></i>
    </div>
    <span
      class="mb-2 mt-4 block self-center whitespace-pre-wrap text-center text-2xl font-bold text-text"
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
