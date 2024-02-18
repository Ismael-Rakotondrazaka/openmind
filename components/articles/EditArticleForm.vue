<template>
  <div>
    <form class="w-full max-w-[700px]" @submit.prevent="">
      <div class="text-[--text-color] text-2xl font-bold mb-3">
        Edit Your Article
      </div>

      <div class="text-[--text-color] mb-7">
        Ready to enhance your content? Update your article with fresh insights
        or additional information. Simply fill in the form below to make your
        changes. Keep your readers engaged with the latest updates!
      </div>

      <div class="mb-7">
        <ArticleTitleInput
          v-model:title="title"
          :error-message="validationErrors.title"
          class="flex gap-2 flex-col w-full"
        />

        <ArticleSummaryInput
          v-model:summary="summary"
          :error-message="validationErrors.summary"
          class="flex gap-2 flex-col w-full"
        />

        <ArticleTagInput
          v-model:tags="tags"
          :error-message="validationErrors.tagIds"
          class="flex gap-2 flex-col"
        />

        <ArticleCoverInput
          v-model:cover="cover"
          class="flex gap-2 flex-col"
          :initial-url="article.coverUrl ?? undefined"
          :error-message="validationErrors.cover"
        />

        <ArticleContentInput
          v-model:content="content"
          class="flex gap-2 flex-col"
          :error-message="validationErrors.content"
        />
      </div>

      <div>
        <PrimeButton
          type="submit"
          :label="saveButtonLabel"
          icon="pi pi-globe"
          :disabled="isSaveButtonDisabled"
          :loading="isSubmitting && isVisible === true"
          class="mr-3"
          @click.prevent="onSaveArticleHandler"
        />

        <PrimeButton
          type="submit"
          label="Save as Draft"
          icon="pi pi-save"
          text
          :disabled="isDraftButtonDisabled"
          :loading="isSubmitting && isVisible === false"
          @click.prevent="onDraftArticleHandler"
        />
      </div>
    </form>

    <PrimeToast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { type FetchError } from "ofetch";
import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";

const toast = useToast();

const fatalError = ref<null | string>(null);

interface EditArticleFormProps {
  article: ArticleFull;
}

const props = defineProps<EditArticleFormProps>();

const article = computed<ArticleFull>(() => props.article);
const tags = ref<Tag[]>([...props.article.tags]);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
  setValues,
  setFieldValue,
} = useForm({
  validationSchema: toTypedSchema(UpdateArticleBodyClientSchema),
  initialValues: {
    title: article.value.title,
    summary: article.value.summary,
    content: article.value.content,
    isVisible: article.value.isVisible,
    tagIds: props.article.tags.map((tag: Tag) => tag.id), // TODO handle initial tagIds
  },
});
const [title] = defineField("title");
const [summary] = defineField("summary");
const [isVisible] = defineField("isVisible");
const [content] = defineField("content");
const [cover] = defineField<"cover", File | null | undefined>("cover");
const [tagIds] = defineField("tagIds");

const formData: ComputedRef<FormData> = computed(() => {
  const formData: FormData = new FormData();

  if (title.value !== undefined) {
    formData.append("title", title.value);
  }
  if (summary.value !== undefined && summary.value !== null) {
    formData.append("summary", summary.value);
  }
  if (isVisible.value !== undefined) {
    formData.append("isVisible", isVisible.value.toString());
  }
  if (content.value !== undefined) {
    formData.append("content", content.value);
  }
  if (cover.value !== undefined) {
    formData.append("cover", cover.value as File);
  }
  if (tagIds.value !== undefined) {
    tagIds.value.forEach((id: number) => {
      formData.append("tagIds", id.toString());
    });
  }

  return formData;
});

watch(tags, (newValue) => {
  tagIds.value = newValue.map((tag: Tag) => tag.id);
});

const {
  data: updatedArticle,
  error: fetchError,
  execute: updateArticle,
}: {
  data: Ref<UpdateArticleData["article"] | null>;
  error: Ref<FetchError<UpdateArticleError> | null>;
  execute: (
    // eslint-disable-next-line no-unused-vars
    opts?: AsyncDataExecuteOptions | undefined,
  ) => Promise<void>;
} = useFetch(() => `/api/articles/${article.value.slug}`, {
  method: "PUT",
  body: formData,
  immediate: false,
  watch: false,
  transform: (
    data: UpdateArticleData | null,
  ): UpdateArticleData["article"] | null =>
    data !== null ? UpdateArticleDataSchema.parse(data).article : null,
});

const submitHandler = handleSubmit(async () => {
  const tagValuesToCreate: string[] = [];

  if (tags.value !== undefined) {
    tags.value.forEach((tag: Tag) => {
      if (tag.id === -1) {
        tagValuesToCreate.push(tag.value);
      }
    });
  }

  const newlyTagIds = await Promise.all(
    tagValuesToCreate.map((value: string) => {
      return $fetch("/api/tags", {
        method: "POST",
        body: {
          value,
        },
      }).then((response) => (response as StoreTagData).tag.id);
    }),
  );

  let finalTagIds: number[] = [];

  if (tagIds.value !== undefined) {
    const filtered = tagIds.value
      .filter((id: number) => id !== -1)
      .concat(...newlyTagIds);

    finalTagIds = filtered;
  }

  setFieldValue("tagIds", finalTagIds);

  fatalError.value = null;
  await updateArticle();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "Article successfully updated!",
      life: 5000,
    });

    resetForm();
    navigateTo({
      name: "articles-slug",
      params: {
        slug: updatedArticle.value?.slug ?? "",
      },
    });
  } else {
    fatalError.value =
      fetchError.value.data?.message ??
      errorConfig.DEFAULT_GENERAL_ERROR_MESSAGE;

    if (fetchError.value.data?.errorMessage) {
      setErrors(fetchError.value.data.errorMessage);
    }

    toast.add({
      severity: "error",
      summary: fatalError.value,
      life: 5000,
    });
  }
});

const onDraftArticleHandler = () => {
  setValues({ isVisible: false });
  submitHandler();
};

const onSaveArticleHandler = () => {
  setValues({ isVisible: true });
  submitHandler();
};

const haveChanges = computed<boolean>(() => {
  const isTitleChanged = article.value.title !== title.value;
  const isSummaryChanged = article.value.summary !== summary.value;
  const isIsVisibleChanged = article.value.isVisible !== isVisible.value;
  const isContentChanged = article.value.content !== content.value;
  const isCoverChanged =
    cover.value !== undefined && cover.value !== article.value.coverUrl;
  let isTagIdsChanged = false;

  if (tagIds.value !== undefined) {
    if (tagIds.value.length !== article.value.tags.length) {
      isTagIdsChanged = true;
    } else {
      const oldTagIdsSet = new Set<number>(
        article.value.tags.map((tag: Tag) => tag.id),
      );

      for (const id of tagIds.value) {
        if (!oldTagIdsSet.has(id)) {
          isTagIdsChanged = true;
          break;
        }
      }
    }
  }

  const result =
    isTitleChanged ||
    isSummaryChanged ||
    isIsVisibleChanged ||
    isContentChanged ||
    isCoverChanged ||
    isTagIdsChanged;

  return result;
});

const isSaveButtonDisabled = computed<boolean>(
  () => !haveChanges.value && article.value.isVisible === true,
);

const isDraftButtonDisabled = computed<boolean>(
  () => !haveChanges.value && article.value.isVisible === false,
);

const saveButtonLabel = computed<string>(() => {
  const saveButtonTexts = {
    SAVE_AND_PUBLISH: "Save and Publish",
    PUBLISH: "Publish",
  };

  if (haveChanges.value === false && article.value.isVisible === false) {
    return saveButtonTexts.PUBLISH;
  } else {
    return saveButtonTexts.SAVE_AND_PUBLISH;
  }
});

watch(summary, (newValue) => {
  if (newValue === "" || newValue === undefined) {
    setFieldValue("summary", null);
  }
});
</script>
