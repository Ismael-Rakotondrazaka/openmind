<template>
  <form class="w-full max-w-[700px]" @submit.prevent="">
    <ArticleTagInput
      v-model:tags="tags"
      :error-message="validationErrors.tagIds"
      class="flex flex-col gap-2"
    />

    <PrimeButton
      type="submit"
      label="Update tags preference"
      icon="pi pi-globe"
      :disabled="isSaveButtonDisabled"
      :loading="isSubmitting"
      class="mr-3"
      @click.prevent="onSaveUserHandler"
    />
  </form>
</template>

<script setup lang="ts">
import { useIndexUserTag, useUpdateUserTag } from "~/composables";

const toast = useToast();

const fatalError = ref<null | string>(null);

const { user: authUser } = useAuthUser();

const { tags: initialTags, execute: refreshInitialTags } = useIndexUserTag({
  immediate: true,
});

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: toTypedSchema(UpdateUserTagBodySchema),
  initialValues: {
    tagIds: initialTags.value
      ? initialTags.value.map((tag: Tag) => tag.id)
      : [],
  },
});

const [tagIds] = defineField("tagIds");

const tags = ref<Tag[]>([...(initialTags.value ?? [])]);
watch(
  initialTags,
  (newValue) => {
    tags.value = newValue ?? [];
  },
  {
    immediate: true,
  },
);

watch(
  tags,
  (newValue) => {
    tagIds.value = newValue.map((tag: Tag) => tag.id);
  },
  {
    immediate: true,
  },
);

const { error: fetchError, execute: updateUserTag } = useUpdateUserTag({
  body: () => ({
    tagIds: tagIds.value ?? [],
  }),
  immediate: false,
});

const submitHandler = handleSubmit(async () => {
  fatalError.value = null;
  await updateUserTag();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "Profile successfully updated!",
      life: notificationConfig.LIFE,
    });

    await refreshInitialTags();

    resetForm();

    navigateTo({
      name: "users-username",
      params: {
        username: authUser.value!.username,
      },
    });
  } else {
    fatalError.value = fetchError.value.message;

    if (fetchError.value.errorMessage) {
      setErrors(fetchError.value.errorMessage);
    }

    toast.add({
      severity: "error",
      summary: fatalError.value,
      life: notificationConfig.LIFE,
    });
  }
});

const onSaveUserHandler = () => {
  submitHandler();
};

const haveChanges = computed<boolean>(() => {
  let isTagIdsChanged = false;

  if (tagIds.value !== undefined) {
    if (tagIds.value.length !== (initialTags.value ?? []).length) {
      isTagIdsChanged = true;
    } else {
      const oldTagIdsSet = new Set<number>(
        (initialTags.value ?? []).map((tag: Tag) => tag.id),
      );

      for (const id of tagIds.value) {
        if (!oldTagIdsSet.has(id)) {
          isTagIdsChanged = true;
          break;
        }
      }
    }
  }

  const result: boolean = isTagIdsChanged;

  return result;
});

const isSaveButtonDisabled = computed<boolean>(() => !haveChanges.value);
</script>
