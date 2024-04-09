<template>
  <PrimeButton
    icon="pi pi-ellipsis-h"
    text
    size="small"
    severity="secondary"
    :pt="{
      root: {
        class: 'px-1 py-0 w-[unset]',
      },
    }"
    @click="toggleOverLayPanel"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex flex-col gap-3 flex-nowrap">
      <PrimeButton
        icon="pi pi-pencil"
        outlined
        severity="info"
        :pt="{
          root: {
            class: 'w-full',
          },
        }"
        label="Edit"
        :disabled="!isCommentEditable"
        @click="onEditHandler"
      />

      <DeleteCommentForm :comment="comment" @comment:delete="onDeleteHandler" />

      <!-- <PrimeButton
        icon="pi pi-trash"
        outlined
        severity="danger"
        :pt="{
          root: {
            class: 'w-full',
          },
        }"
        label="Delete"
        :disabled="!isCommentEditable"
        @click="onDeleteHandler"
      /> -->
    </div>
  </PrimeOverlayPanel>
</template>

<script lang="ts" setup>
import type { PrimeOverlayPanel } from "#build/components";

interface ICommentOptionsButtonProps {
  comment: CommentFull;
}

const props = defineProps<ICommentOptionsButtonProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const overlayPanel = ref<InstanceType<typeof PrimeOverlayPanel>>();

const isCommentEditable = computed<boolean>(
  () => authUser.value !== null && props.comment.user.id === authUser.value.id,
);

const toggleOverLayPanel = (event: Event) => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.toggle(event);
  }
};

const closeOverLayPanel = () => {
  if (overlayPanel.value !== undefined) {
    overlayPanel.value.hide();
  }
};

type ICommentOptionsButtonEmits = {
  "comment:edit": [];
  "comment:delete": [];
};

const emit = defineEmits<ICommentOptionsButtonEmits>();

const onDeleteHandler = () => {
  if (isCommentEditable.value) {
    emit("comment:delete");
    closeOverLayPanel();
  }
};

const onEditHandler = () => {
  if (isCommentEditable.value) {
    emit("comment:edit");
    closeOverLayPanel();
  }
};
</script>
