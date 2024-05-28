<template>
  <PrimeButton
    v-if="haveOptions"
    icon="pi pi-ellipsis-h"
    text
    size="small"
    severity="secondary"
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
        class="align-items-center flex"
        v-bind="menuRouterBindProps.action"
        :class="item.class"
      >
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <PrimeBadge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span
          v-if="item.shortcut"
          class="border-1 surface-border border-round surface-100 ml-auto p-1 text-xs"
          >{{ item.shortcut }}</span
        >
      </a>
    </template>
  </PrimeMenu>

  <DeleteCommentForm
    v-if="isCommentDeletable"
    v-model:is-visible="isDeleteDialogVisible"
    :comment="comment"
    @comment:delete="onDeleteHandler"
  />
</template>

<script lang="ts" setup>
import type PrimeMenu from "primevue/menu";
import { type MenuProps } from "primevue/menu";

type MenuItem = Exclude<MenuProps["model"], undefined>[0];

interface ICommentOptionsButtonProps {
  comment: CommentFull;
}

const props = defineProps<ICommentOptionsButtonProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const overlayMenu = ref<InstanceType<typeof PrimeMenu>>();

const isCommentEditable = computed<boolean>(
  () => authUser.value !== null && props.comment.user.id === authUser.value.id,
);

const isCommentDeletable = computed<boolean>(
  () => authUser.value !== null && props.comment.user.id === authUser.value.id,
);

const haveOptions = computed<boolean>(
  () => isCommentEditable.value || isCommentDeletable.value,
);

const toggleOverLayMenu = (event: Event) => {
  if (overlayMenu.value !== undefined) {
    overlayMenu.value.toggle(event);
  }
};

const closeOverLayMenu = () => {
  if (overlayMenu.value !== undefined) {
    overlayMenu.value.hide();
  }
};

type ICommentOptionsButtonEmits = {
  "comment:edit": [];
  "comment:delete": [];
};

const emit = defineEmits<ICommentOptionsButtonEmits>();

const onDeleteHandler = () => {
  emit("comment:delete");
  closeOverLayMenu();
};

const editMenuItem: MenuItem = {
  label: "Edit",
  icon: "pi pi-pencil",
  command: () => {
    emit("comment:edit");
    closeOverLayMenu();
  },
  class: "!text-info",
};

const isDeleteDialogVisible = ref<boolean>(false);

const deleteMenuItem: MenuItem = {
  label: "Delete",
  icon: "pi pi-trash",
  command: () => {
    isDeleteDialogVisible.value = true;
  },
  class: "!text-danger",
};

const menuItems = computed<MenuItem[]>(() => {
  const result: MenuItem[] = [];

  if (isCommentEditable.value) {
    result.push(editMenuItem);
  }
  if (isCommentDeletable.value) {
    result.push(deleteMenuItem);
  }

  return result;
});
</script>
