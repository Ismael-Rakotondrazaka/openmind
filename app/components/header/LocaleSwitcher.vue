<template>
  <Select :model-value="locale" @update:model-value="handleSelect">
    <SelectTrigger
      class="w-fit border-0 bg-transparent shadow-none"
      size="sm"
    >
      <SelectValue>
        <Icon name="mdi:translate" class="size-5 shrink-0" />
        <span class="hidden lg:inline">{{ currentLabel }}</span>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="en">English</SelectItem>
      <SelectItem value="fr">Français</SelectItem>
    </SelectContent>
  </Select>
</template>

<script lang="ts" setup>
import type { AcceptableValue } from 'reka-ui';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const { locale } = useI18n({ useScope: 'global' });
const switchLocalePath = useSwitchLocalePath();

const localeOptions: Record<string, string> = {
  en: 'English',
  fr: 'Français',
};

const currentLabel = computed(
  () => localeOptions[locale.value] ?? locale.value
);

function handleSelect(value: AcceptableValue) {
  if (typeof value !== 'string') return;
  const newPath = switchLocalePath(value as 'en' | 'fr');
  navigateTo(newPath);
}
</script>
