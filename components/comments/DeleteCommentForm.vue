<template>
  <ConfirmDialog
    v-model:is-visible="isVisible"
    header="Delete Comment"
    message="Are you sure you want to delete this comment ?"
    severity="danger"
    resolve-button-label="Yes, Delete"
    reject-button-label="Cancel"
    :info-list="infoList"
    :is-loading="isStatusPending"
    @dialog:resolved="destroyCommentHandler"
  />
</template>

<script setup lang="ts">
import { useDestroyComment } from "~/composables";

/* ---------------------------------- Props --------------------------------- */
interface IDeleteCommentFormProps {
  comment: CommentFull;
}

const props = defineProps<IDeleteCommentFormProps>();
/* -------------------------------------------------------------------------- */

const isVisible = defineModel<boolean>("isVisible", {
  required: false,
  default: false,
});

type IDeleteCommentFormEmits = {
  "comment:delete": [string];
};

const emit = defineEmits<IDeleteCommentFormEmits>();

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

const infoList: string[] = ["Once deleted, it cannot be undone."];
</script>
