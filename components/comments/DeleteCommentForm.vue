<template>
  <ConfirmDialog
    v-model:is-visible="isConfirmationVisible"
    header="Delete Comment"
    message="Are you sure you want to delete this comment ?"
    severity="danger"
    resolve-button-label="Yes, Delete"
    reject-button-label="Cancel"
    :info-list="infoList"
    :is-loading="isStatusPending"
    @dialog:resolved="destroyCommentHandler"
  />

  <PrimeButton
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
    @click="onShowConfirmation"
  ></PrimeButton>
</template>

<script setup lang="ts">
import { useDestroyComment } from "~/composables";

/* ---------------------------------- Props --------------------------------- */
interface IDeleteCommentFormProps {
  comment: CommentFull;
}

const props = defineProps<IDeleteCommentFormProps>();
/* -------------------------------------------------------------------------- */

type IDeleteCommentFormEmits = {
  "comment:delete": [string];
};

const emit = defineEmits<IDeleteCommentFormEmits>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const toast = useToast();

const params = computed(() => ({
  id: props.comment.id,
}));

const fatalError = ref<string | null>(null);

const {
  commentFull: deletedComment,
  execute: destroyComment,
  error: fetchError,
  isStatusPending,
} = useDestroyComment({
  params,
});

const destroyCommentHandler = async () => {
  await destroyComment();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "info",
      summary: "Comment successfully deleted!",
      life: notificationConfig.LIFE,
    });

    if (deletedComment.value !== null) {
      emit("comment:delete", deletedComment.value.id);
    }
  } else {
    fatalError.value =
      fetchError.value.message ?? errorConfig.DEFAULT_GENERAL_ERROR_MESSAGE;

    toast.add({
      severity: "error",
      summary: fatalError.value,
      life: notificationConfig.LIFE,
    });
  }
};

const isCommentEditable = computed<boolean>(
  () => authUser.value !== null && props.comment.user.id === authUser.value.id,
);

const infoList: string[] = ["Once deleted, it cannot be undone."];

const isConfirmationVisible = ref<boolean>(false);

const onShowConfirmation = () => {
  isConfirmationVisible.value = true;
};
</script>
