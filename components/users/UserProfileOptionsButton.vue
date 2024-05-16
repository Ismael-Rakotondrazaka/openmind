<template>
  <PrimeButton
    v-if="haveOptions"
    icon="pi pi-ellipsis-h"
    text
    size="small"
    severity="secondary"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    :pt="{
      root: {
        class: 'px-1 py-0 w-[unset]',
      },
    }"
    @click="toggleOverLayMenu"
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
</template>

<script lang="ts" setup>
import type PrimeMenu from "primevue/menu";
import { type MenuProps } from "primevue/menu";

type MenuItem = Exclude<MenuProps["model"], undefined>[0];

interface IUserProfileOptionsButtonProps {
  user: UserFull;
}

const props = defineProps<IUserProfileOptionsButtonProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const overlayMenu = ref<InstanceType<typeof PrimeMenu>>();

const isProfileEditable = computed<boolean>(
  () => authUser.value !== null && props.user.id === authUser.value.id,
);

const haveOptions = computed<boolean>(() =>
  [isProfileEditable.value].includes(true),
);

const toggleOverLayMenu = (event: Event) => {
  if (overlayMenu.value !== undefined) {
    overlayMenu.value.toggle(event);
  }
};

const editMenuItem: MenuItem = {
  label: "Edit profile",
  icon: "pi pi-pencil",
  command: () => {
    navigateTo({
      name: "users-username-edit",
      params: {
        username: props.user.username,
      },
    });
  },
  class: "!text-info",
};

const menuItems = computed<MenuItem[]>(() => {
  const result: MenuItem[] = [];

  if (isProfileEditable.value) {
    result.push(editMenuItem);
  }

  return result;
});
</script>
