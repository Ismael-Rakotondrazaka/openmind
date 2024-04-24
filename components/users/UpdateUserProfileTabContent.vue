<template>
  <form class="w-full max-w-[700px]" @submit.prevent="">
    <div class="mb-7">
      <div class="flex items-center gap-3">
        <UserFirstNameInput
          v-model:firstName="firstName"
          :error-message="validationErrors.firstName"
          class="flex flex-col w-full gap-2"
        />

        <UserNameInput
          v-model:name="name"
          :error-message="validationErrors.name"
          class="flex flex-col w-full gap-2"
        />
      </div>

      <UserProfileInput
        v-model:profile="profile"
        class="flex flex-col gap-2"
        :initial-url="user.profileUrl ?? undefined"
        :error-message="validationErrors.profile"
      />
    </div>

    <PrimeButton
      type="submit"
      label="Update profile"
      icon="pi pi-globe"
      :disabled="isSaveButtonDisabled"
      :loading="isSubmitting"
      class="mr-3"
      @click.prevent="onSaveUserHandler"
    />
  </form>
</template>

<script setup lang="ts">
const toast = useToast();

const fatalError = ref<null | string>(null);

interface EditUserFormProps {
  user: UserFull;
}

const props = defineProps<EditUserFormProps>();

const user = computed<UserFull>(() => props.user);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: toTypedSchema(UpdateUserBodyClientSchema),
  initialValues: {
    firstName: user.value.firstName,
    name: user.value.name,
    profile: undefined,
  },
});

const [firstName] = defineField("firstName");
const [name] = defineField("name");
const [profile] = defineField<"profile", File | null | undefined>("profile");

const {
  user: updatedUser,
  error: fetchError,
  execute: updateUser,
} = useUpdateUser({
  params: () => ({
    username: user.value.username,
  }),
  body: () => ({
    firstName: firstName.value,
    name: name.value,
    profile: profile.value,
  }),
  immediate: false,
});

const submitHandler = handleSubmit(async () => {
  fatalError.value = null;
  await updateUser();

  if (fetchError.value === null) {
    fatalError.value = null;

    toast.add({
      severity: "success",
      summary: "User successfully updated!",
      life: notificationConfig.LIFE,
    });

    resetForm();

    navigateTo({
      name: "users-username",
      params: {
        username: updatedUser.value!.username,
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
  const isFirstNameChanged = user.value.firstName !== firstName.value;
  const isNameChanged = user.value.name !== name.value;
  const isProfileChanged =
    profile.value !== undefined && profile.value !== user.value.profileUrl;

  const result = isFirstNameChanged || isNameChanged || isProfileChanged;

  return result;
});

const isSaveButtonDisabled = computed<boolean>(() => !haveChanges.value);
</script>
