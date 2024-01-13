<template>
  <div class="flex items-center justify-center min-h-screen p-5 bg-sky-50">
    <form class="w-full max-w-[700px]" @submit.prevent="">
      <PrimeCard>
        <template #title> Create Your Account </template>

        <template #subtitle>
          Join us by creating your account! Unlock a world of possibilities and
          exclusive features. Fill in the required information to start your
          personalized journey with us.
        </template>

        <template #content>
          <div class="flex flex-row flex-nowrap gap-x-2">
            <div class="flex gap-2 flex-col w-full">
              <label for="name">title</label>
              <PrimeInputText
                id="title"
                v-model="title"
                :class="{ 'p-invalid': validationErrors.title }"
              />
              <small id="email-or-isVisible-text-error" class="text-red-600">{{
                validationErrors.title || "&nbsp;"
              }}</small>
            </div>

            <div class="flex gap-2 flex-col w-full">
              <label for="firstName">Summary</label>
              <PrimeInputText
                id="summary"
                v-model="summary"
                :class="{ 'p-invalid': validationErrors.summary }"
              />
              <small id="email-or-isVisible-text-error" class="text-red-600">{{
                validationErrors.summary || "&nbsp;"
              }}</small>
            </div>
          </div>

          <div class="flex gap-2 flex-col">
            <label for="email">Content</label>
            <PrimeEditor v-model="content" editor-style="height: 320px" />
            <small id="email-text-error" class="text-red-600">{{
              validationErrors.content || "&nbsp;"
            }}</small>
          </div>
        </template>

        <template #footer>
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
        </template>
      </PrimeCard>
    </form>

    <PrimeToast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import { H3Error } from "h3";
import type { AsyncDataExecuteOptions } from "nuxt/dist/app/composables/asyncData";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});

const route = useRoute("articles-slug");

const slug: ComputedRef<string> = computed(() => route.params.slug);

const {
  data: article,
  execute: refetchArticle,
}: {
  data: Ref<ShowArticleData["article"] | null>;
  error: Ref<H3Error<ShowArticleError> | null>;
  execute: (
    // eslint-disable-next-line no-unused-vars
    opts?: AsyncDataExecuteOptions | undefined,
  ) => Promise<ShowArticleData["article"] | null>;
} = await useFetch(() => `/api/articles/${slug.value}`, {
  transform: (value) => showArticleDataSchema.parse(value).article,
});

const toast = useToast();

const fatalError = ref<null | string>(null);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  isSubmitting,
  setErrors,
  setValues,
} = useForm({
  validationSchema: toTypedSchema(StoreArticleBodyClientSchema),
  initialValues: {
    title: article.value?.title ?? "",
    summary: article.value?.summary ?? null,
    content: article.value?.content ?? "",
    isVisible: article.value?.isVisible ?? true,
  },
});
const [title] = defineField("title");
const [summary] = defineField("summary");
const [isVisible] = defineField("isVisible");
const [content] = defineField("content");

const {
  data: updatedArticle,
  error: updateArticleRawError,
  execute: updateArticle,
}: {
  data: Ref<UpdateArticleData["article"] | null>;
  error: Ref<H3Error<UpdateArticleError> | null>;
  execute: (
    // eslint-disable-next-line no-unused-vars
    opts?: AsyncDataExecuteOptions | undefined,
  ) => Promise<UpdateArticleData["article"] | null>;
} = useFetch(() => `/api/articles/${slug.value}`, {
  method: "PUT",
  body: {
    title,
    summary,
    content,
    isVisible,
  },
  immediate: false,
  watch: false,
  transform: (value): UpdateArticleData["article"] =>
    UpdateArticleDataSchema.parse(value).article,
});

const submitHandler = handleSubmit(async () => {
  fatalError.value = null;
  await updateArticle();

  if (updatedArticle.value !== null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "Article successfully updated!",
      life: 5000,
    });

    refetchArticle();

    setValues({
      content: updatedArticle.value.content,
      title: updatedArticle.value.title,
      isVisible: updatedArticle.value.isVisible,
      summary: updatedArticle.value.summary,
    });

    navigateTo({
      name: "articles-slug",
      params: {
        slug: updatedArticle.value.slug,
      },
    });
  } else if (updateArticleRawError.value !== null) {
    fatalError.value =
      updateArticleRawError.value.data?.message ??
      errorConfig.DEFAULT_GENERAL_ERROR_MESSAGE;

    if (updateArticleRawError.value.data?.errorMessage) {
      setErrors(updateArticleRawError.value.data.errorMessage);
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
</script>
