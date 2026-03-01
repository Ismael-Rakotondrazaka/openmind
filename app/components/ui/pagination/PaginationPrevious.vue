<script setup lang="ts">
import type { PaginationPrevProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { reactiveOmit } from '@vueuse/core';
import { ChevronLeftIcon } from 'lucide-vue-next';
import { PaginationPrev, useForwardProps } from 'reka-ui';

import type { ButtonVariants } from '@/components/ui/button';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<
    {
      class?: HTMLAttributes['class'];
      size?: ButtonVariants['size'];
    } & PaginationPrevProps
  >(),
  {
    class: undefined,
    size: 'default',
  }
);

const delegatedProps = reactiveOmit(props, 'class', 'size');
const forwarded = useForwardProps(delegatedProps);
</script>

<template>
  <PaginationPrev
    data-slot="pagination-previous"
    :class="
      cn(
        buttonVariants({ variant: 'ghost', size }),
        'gap-1 px-2.5 sm:pr-2.5',
        props.class
      )
    "
    v-bind="forwarded"
  >
    <slot>
      <ChevronLeftIcon />
      <span class="hidden sm:block">Previous</span>
    </slot>
  </PaginationPrev>
</template>
