<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const isDesktop = useMediaQuery('(min-width: 640px)');

const Modal = computed(() => ({
  Close: isDesktop.value ? DialogClose : DrawerClose,
  Content: isDesktop.value ? DialogContent : DrawerContent,
  Description: isDesktop.value ? DialogDescription : DrawerDescription,
  Footer: isDesktop.value ? DialogFooter : DrawerFooter,
  Header: isDesktop.value ? DialogHeader : DrawerHeader,
  Root: isDesktop.value ? Dialog : Drawer,
  Title: isDesktop.value ? DialogTitle : DrawerTitle,
  Trigger: isDesktop.value ? DialogTrigger : DrawerTrigger,
}));

const open = defineModel<boolean>('open', {
  default: false,
  required: false,
});
</script>

<template>
  <component :is="Modal.Root" v-model:open="open">
    <component :is="Modal.Trigger" v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </component>
    <component
      :is="Modal.Content"
      class="sm:max-w-md"
      :class="[{ 'px-2 pb-8 *:px-4': !isDesktop }]"
    >
      <component :is="Modal.Header" v-if="$slots.title || $slots.description">
        <component :is="Modal.Title" v-if="$slots.title">
          <slot name="title" />
        </component>
        <component :is="Modal.Description" v-if="$slots.description">
          <slot name="description" />
        </component>
      </component>

      <slot />

      <component :is="Modal.Footer" v-if="$slots.close" class="pt-4">
        <component :is="Modal.Close" v-if="$slots.close" as-child>
          <slot name="close" />
        </component>
      </component>
    </component>
  </component>
</template>
