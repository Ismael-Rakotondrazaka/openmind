<template>
  <PrimeButton
    label="Following"
    icon="pi pi-chevron-down"
    severity="secondary"
    outlined
    @click="onOpenMenuHandler"
  />

  <PrimeMenu
    id="overlay_menu"
    ref="overlayMenu"
    :model="menuItems"
    :popup="true"
  >
    <template #item="{ item, props: menuRouterBindProps }">
      <a
        v-ripple
        class="flex align-items-center"
        v-bind="menuRouterBindProps.action"
        :class="item.class"
      >
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <PrimeBadge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
          >{{ item.shortcut }}</span
        >
      </a>
    </template>
  </PrimeMenu>

  <DestroyFollowForm
    v-model:is-visible="isUnfollowDialogVisible"
    :follow="follow"
    @follows:destroy="onFollowDestroyHandler"
  />
</template>

<script setup lang="ts">
import { type Follow } from "@prisma/client";
import type PrimeMenu from "primevue/menu";
import { type MenuProps } from "primevue/menu";

type MenuItem = Exclude<MenuProps["model"], undefined>[0];

interface FollowingButtonProps {
  follow: FollowFull;
}

const props = defineProps<FollowingButtonProps>();

type FollowingButtonEmits = {
  "follows:destroy": [Follow];
};

const emit = defineEmits<FollowingButtonEmits>();

const onFollowDestroyHandler = (follow: Follow) => {
  emit("follows:destroy", follow);
};

const overlayMenu = ref<InstanceType<typeof PrimeMenu>>();

const onOpenMenuHandler = (event: Event) => {
  if (overlayMenu.value !== undefined) {
    overlayMenu.value.toggle(event);
  }
};

const formattedFollowingDate = useDateFormat(
  () => props.follow.createdAt,
  "MMMM, D YYYY",
);

const isUnfollowDialogVisible = ref<boolean>(false);

const menuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: `Followed since ${formattedFollowingDate.value}`,
      items: [
        {
          label: "Unfollow",
          icon: "pi pi-user-minus",
          command: () => {
            isUnfollowDialogVisible.value = true;
          },
          class: "!text-danger",
        },
      ],
    },
  ];
});
</script>
