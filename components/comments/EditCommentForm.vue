<template>
  <PrimeDialog
    v-model:visible="isVisible"
    modal
    maximizable
    header="Edit comment"
  >
    <form class="" method="post" @submit.prevent="onSubmitHandler">
      <CommentContentInputForm
        v-model:content="content"
        :current="comment"
        :parent="null"
        :error-message="validationErrors.content"
        class="w-full mb-3"
      />

      <PrimeButton
        type="submit"
        label="Update"
        icon="pi pi-save"
        :loading="isSubmitting"
        class="mr-3"
      />

      <PrimeButton
        severity="secondary"
        type="button"
        label="Cancel"
        icon="pi pi-ban"
        outlined
        :loading="isSubmitting"
        @click.prevent="onUpdateCancelHandler"
      />
    </form>
  </PrimeDialog>
</template>

<script lang="ts" setup>
interface ICreateCommentFormProps {
  comment: CommentFull;
}

const props = defineProps<ICreateCommentFormProps>();

const isVisible = defineModel<boolean>("isVisible", {
  required: true,
});

type ICreateCommentFormEmits = {
  "comments:update": [CommentFull];
  "update:cancel": [];
};

const emit = defineEmits<ICreateCommentFormEmits>();

const toast = useToast();

const fatalError = ref<null | string>(null);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: toTypedSchema(UpdateCommentBodyClientSchema),
  initialValues: {
    content: props.comment.content,
  },
});
const [content] = defineField<"content", UpdateCommentBody["content"]>(
  "content",
);

const body = computed<UpdateCommentBody>(() => {
  return {
    content: content.value,
  };
});

const params = computed<UpdateCommentParam>(() => {
  return {
    id: props.comment.id,
  };
});

const {
  commentFull: createdComment,
  execute: updateComment,
  error: fetchError,
} = useUpdateComment({
  body,
  params,
});

const onSubmitHandler = handleSubmit(async () => {
  await updateComment();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "Comment successfully updated!",
      life: notificationConfig.LIFE,
    });

    resetForm();

    if (createdComment.value !== null) {
      emit("comments:update", createdComment.value);
    }
  } else {
    fatalError.value =
      fetchError.value.message ?? errorConfig.DEFAULT_GENERAL_ERROR_MESSAGE;

    if (fetchError.value?.errorMessage) {
      setErrors(fetchError.value.errorMessage);
    }

    toast.add({
      severity: "error",
      summary: fatalError.value,
      life: notificationConfig.LIFE,
    });
  }
});

const onUpdateCancelHandler = () => {
  emit("update:cancel");
};
</script>
