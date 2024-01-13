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
            <label for="cover">Cover</label>

            <input
              id="cover"
              ref="coverRef"
              type="file"
              class="block w-full file:mr-4 file:py-4 file:px-5 file:rounded-md file:border-0 file:font-bold file:bg-[#14b8a6] file:text-white hover:file:bg-[#0d9488] hover:cursor-pointer"
              name="cover"
              @change="onCoverChangeHandler"
            />

            <small id="cover-text-error" class="text-red-600">{{
              validationErrors.cover || "&nbsp;"
            }}</small>
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
import { FetchError } from "ofetch";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});

const toast = useToast();

const coverRef: Ref<HTMLInputElement | null> = ref(null);
const fatalError = ref<null | string>(null);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
  setValues,
} = useForm({
  validationSchema: toTypedSchema(StoreArticleBodyClientSchema),
  initialValues: {
    title: "",
    summary: null,
    content: "",
    isVisible: true,
  },
});
const [title] = defineField("title");
const [summary] = defineField("summary");
const [isVisible] = defineField("isVisible");
const [content] = defineField("content");
const [cover] = defineField("cover");

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

  return formData;
});

const { error: fetchError, execute: storeRegister } = useFetch<
  StoreArticleData,
  FetchError<StoreArticleError>
>("/api/articles", {
  method: "POST",
  body: formData,
  immediate: false,
  watch: false,
});

const resetCoverFiles = () => {
  if (coverRef.value !== null) {
    coverRef.value.files = new DataTransfer().files;
  }
};

const onCoverChangeHandler = (event: Event) => {
  const target: HTMLInputElement | null =
    event.target as HTMLInputElement | null;
  if (target === null) return;

  const files: FileList | null = target.files;
  if (files === null) return;

  const file: File | null = files.item(0);
  if (file === null) return;

  setValues({
    cover: file,
  });
};

const submitHandler = handleSubmit(async () => {
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
    resetCoverFiles();
    // TODO redirect to show-article page
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

onMounted(() => {
  resetCoverFiles();
});
</script>
