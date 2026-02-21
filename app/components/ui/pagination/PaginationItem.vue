<script setup lang="ts">
import type { PaginationListItemProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';

import { reactiveOmit } from '@vueuse/core';
import { PaginationListItem } from 'reka-ui';

import type { ButtonVariants } from '@/components/ui/button';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<
    {
      class?: HTMLAttributes['class'];
      isActive?: boolean;
      size?: ButtonVariants['size'];
    } & PaginationListItemProps
  >(),
  {
    size: 'icon',
  }
);

const delegatedProps = reactiveOmit(props, 'class', 'size', 'isActive');
</script>

<template>
  <PaginationListItem
    data-slot="pagination-item"
    v-bind="delegatedProps"
    :class="
      cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        props.class
      )
    "
  >
    <slot />
  </PaginationListItem>
</template>
