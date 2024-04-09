<template>
  <PrimeDialog
    v-model:visible="isVisible"
    modal
    maximizable
    header="Create comment"
  >
    <form class="" method="post" @submit.prevent="onSubmitHandler">
      <CommentContentInputForm
        v-model:content="content"
        :current="current"
        :parent="parent"
        :error-message="validationErrors.content"
        class="w-full mb-3"
      />

      <PrimeButton
        type="submit"
        label="Post"
        icon="pi pi-globe"
        :loading="isSubmitting"
      />
    </form>
  </PrimeDialog>
</template>

<script lang="ts" setup>
import CommentContentInputForm from "./CommentContentInputForm.vue";

interface ICreateCommentFormProps {
  parent: CommentFull | null;
  current: CommentFull | null;
}

const props = defineProps<ICreateCommentFormProps>();

const { article } = inject(ShowArticleToken) as ShowArticleDI;

const isVisible = defineModel<boolean>("isVisible", {
  required: true,
});

type ICreateCommentFormEmits = {
  "comments:store": [CommentFull];
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
  validationSchema: toTypedSchema(StoreCommentBodyClientSchema),
  initialValues: {
    articleId: article.value.id,
    parentId: props.current?.id,
    content: "",
  },
});
const [articleId] = defineField<"articleId", StoreCommentBody["articleId"]>(
  "articleId",
);
const [parentId] = defineField<"parentId", StoreCommentBody["parentId"]>(
  "parentId",
);
const [content] = defineField<"content", StoreCommentBody["content"]>(
  "content",
);

const body = computed<StoreCommentBody>(() => {
  return {
    articleId: articleId.value,
    parentId: parentId.value,
    content: content.value,
  };
});

const {
  commentFull: createdComment,
  execute: storeComment,
  error: fetchError,
} = useStoreComment({
  body,
});

const onSubmitHandler = handleSubmit(async () => {
  await storeComment();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "Comment successfully posted!",
      life: 5000,
    });

    resetForm();

    if (createdComment.value !== null) {
      emit("comments:store", createdComment.value);
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
      life: 5000,
    });
  }
});
</script>
