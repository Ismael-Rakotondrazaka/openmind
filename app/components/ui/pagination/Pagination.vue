<script setup lang="ts">
import type { PaginationRootEmits, PaginationRootProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { reactiveOmit } from '@vueuse/core';
import { PaginationRoot, useForwardPropsEmits } from 'reka-ui';

import { cn } from '@/lib/utils';

const props = defineProps<
  {
    class?: HTMLAttributes['class'];
  } & PaginationRootProps
>();
const emits = defineEmits<PaginationRootEmits>();

const delegatedProps = reactiveOmit(props, 'class');
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <PaginationRoot
    v-slot="slotProps"
    data-slot="pagination"
    v-bind="forwarded"
    :class="cn('mx-auto flex w-full justify-center', props.class)"
  >
    <slot v-bind="slotProps" />
  </PaginationRoot>
</template>
