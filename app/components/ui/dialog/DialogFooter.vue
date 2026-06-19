<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

import { DialogClose } from 'reka-ui';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class'];
    showCloseButton?: boolean;
  }>(),
  {
    class: undefined,
    showCloseButton: false,
  }
);

const { t } = useI18n();
</script>

<template>
  <div
    data-slot="dialog-footer"
    :class="
      cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', props.class)
    "
  >
    <slot />
    <DialogClose v-if="showCloseButton" as-child>
      <Button variant="outline">{{ t('buttons.close') }}</Button>
    </DialogClose>
  </div>
</template>
