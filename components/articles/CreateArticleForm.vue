<template>
  <div>
    <form class="w-full" @submit.prevent="">
      <div class="text-text text-2xl font-bold mb-3">Create Your Article</div>

      <div class="text-text mb-7">
        Get ready to share your thoughts! Creating an article is easy. Just fill
        out the form below, and let your ideas shine. Start now and be part of
        our community!
      </div>

      <div class="mb-7">
        <ArticleTitleInput
          v-model:title="title"
          :error-message="validationErrors.title"
          class="flex flex-col w-full gap-2"
        />

        <ArticleSummaryInput
          v-model:summary="summary"
          :error-message="validationErrors.summary"
          class="flex flex-col w-full gap-2"
        />

        <ArticleTagInput
          v-model:tags="tags"
          :error-message="validationErrors.tagIds"
          class="flex flex-col gap-2"
        />

        <ArticleCoverInput
          v-model:cover="cover"
          class="flex flex-col gap-2"
          :error-message="validationErrors.cover"
        />

        <ArticleContentInput
          v-model:content="content"
          class="flex flex-col gap-2"
          :error-message="validationErrors.content"
        />
      </div>

      <div class="flex items-center flex-wrap gap-3 justify-start">
        <PrimeButton
          type="submit"
          label="Publish"
          icon="pi pi-globe"
          :loading="isSubmitting && isVisible === true"
          class="mr-3"
          @click.prevent="onPublishArticleHandler"
        />

        <PrimeButton
          type="submit"
          label="Save for later"
          icon="pi pi-save"
          text
          :loading="isSubmitting && isVisible === false"
          @click.prevent="onSaveArticleHandler"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { type FetchError } from "ofetch";
import type { AsyncDataExecuteOptions } from "#app/composables/asyncData";

const toast = useToast();

const fatalError = ref<null | string>(null);

const tags = ref<Tag[]>([]);

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
  validationSchema: toTypedSchema(StoreArticleBodyClientSchema),
  initialValues: {
    title: "",
    summary: null,
    content: "",
    isVisible: true,
    tagIds: [],
  },
});
const [title] = defineField("title");
const [summary] = defineField("summary");
const [isVisible] = defineField("isVisible");
const [content] = defineField("content");
const [cover] = defineField<"cover", File | undefined | null>("cover");
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
  data: article,
  error: fetchError,
  execute: storeRegister,
}: {
  data: Ref<StoreArticleData["article"] | null>;
  error: Ref<FetchError<StoreArticleError> | null>;
  execute: (opts?: AsyncDataExecuteOptions | undefined) => Promise<void>;
} = useFetch("/api/articles", {
  method: "POST",
  body: formData,
  immediate: false,
  watch: false,
  transform: (
    data: StoreArticleData | null,
  ): StoreArticleData["article"] | null =>
    data !== null ? StoreArticleDataSchema.parse(data).article : null,
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
  await storeRegister();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "Article successfully created!",
      life: notificationConfig.LIFE,
    });

    resetForm();
    navigateTo({
      name: "users-username-articles-slug",
      params: {
        username: article.value!.user.username,
        slug: article.value?.slug ?? "",
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
      life: notificationConfig.LIFE,
    });
  }
});

const onSaveArticleHandler = () => {
  setValues({ isVisible: false });
  submitHandler();
};

const onPublishArticleHandler = () => {
  setValues({ isVisible: true });
  submitHandler();
};

watch(summary, (newValue) => {
  if (newValue === "" || newValue === undefined) {
    setFieldValue("summary", null);
  }
});
</script>
