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
    @click="toggleOverLayPanel"
  />

  <PrimeOverlayPanel ref="overlayPanel">
    <div class="flex flex-col gap-3 flex-nowrap">
      <PrimeButton
        v-if="isCommentEditable"
        icon="pi pi-pencil"
        outlined
        severity="info"
        :pt="{
          root: {
            class: 'w-full',
          },
        }"
        label="Edit"
        @click="onEditHandler"
      />

      <DeleteCommentForm
        v-if="isCommentDeletable"
        :comment="comment"
        @comment:delete="onDeleteHandler"
      />
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

const isCommentDeletable = computed<boolean>(
  () => authUser.value !== null && props.comment.user.id === authUser.value.id,
);

const haveOptions = computed<boolean>(
  () => isCommentEditable.value || isCommentDeletable.value,
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
  emit("comment:delete");
  closeOverLayPanel();
};

const onEditHandler = () => {
  emit("comment:edit");
  closeOverLayPanel();
};
</script>
