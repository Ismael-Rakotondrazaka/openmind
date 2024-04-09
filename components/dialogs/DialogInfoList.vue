<template>
  <ul class="ml-5 list-disc">
    <li v-for="(info, index) in informations" :key="index" :class="[liClass]">
      <p class="inline text-text" :class="[pClass]">
        {{ info }}
      </p>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Severity } from "~/utils";

interface IDialogInfoListProps {
  informations?: string[];
  severity?: Severity;
}

const props = withDefaults(defineProps<IDialogInfoListProps>(), {
  informations: (): string[] => [],
  severity: "primary",
});

const severityLiClass: Record<Severity, string> = {
  primary: "text-primary",
  info: "text-info",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
  contrast: "text-contrast",
  secondary: "text-secondary",
};

const liClass = computed(() => severityLiClass[props.severity]);

const severityPClass: Record<Severity, string> = {
  primary: "hover:text-primary",
  info: "hover:text-info",
  danger: "hover:text-danger",
  success: "hover:text-success",
  warning: "hover:text-warning",
  contrast: "hover:text-contrast",
  secondary: "hover:text-secondary",
};

const pClass = computed(() => severityPClass[props.severity]);
</script>
