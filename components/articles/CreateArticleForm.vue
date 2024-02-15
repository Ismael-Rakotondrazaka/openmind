<template>
  <div>
    <form class="w-full max-w-[700px]" @submit.prevent="">
      <div>Create Your Account</div>

      <div>
        Join us by creating your account! Unlock a world of possibilities and
        exclusive features. Fill in the required information to start your
        personalized journey with us.
      </div>

      <div>
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

        <TagInput
          v-model:tags="tags"
          class="flex gap-2 flex-col"
          :error-message="validationErrors.tagIds"
        />

        <!-- ! vee-validate turns File type (not the value) to PartialObjectDeep<File, {}> -->
        <!-- eslint-disable vue/valid-v-model -->
        <ArticleCoverInput
          v-model:cover="cover as File | undefined | null"
          class="flex gap-2 flex-col"
          :error-message="validationErrors.cover"
        />
        <!-- eslint-enable vue/valid-v-model -->

        <ArticleContentInput
          v-model:content="content"
          class="flex gap-2 flex-col"
          :error-message="validationErrors.content"
        />
      </div>

      <div>
        <PrimeButton
          type="submit"
          label="Post"
          :loading="isSubmitting && isVisible === true"
          @click.prevent="onPublishArticleHandler"
        />

        <PrimeButton
          type="submit"
          label="Save for later"
          :loading="isSubmitting && isVisible === false"
          @click.prevent="onSaveArticleHandler"
        />
      </div>
    </form>

    <PrimeToast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { type FetchError } from "ofetch";
import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";

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
const [cover] = defineField("cover");
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
  execute: (
    // eslint-disable-next-line no-unused-vars
    opts?: AsyncDataExecuteOptions | undefined,
  ) => Promise<void>;
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
      life: 5000,
    });

    resetForm();
    navigateTo({
      name: "articles-slug",
      params: {
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
      life: 5000,
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
