<template>
  <div class="mx-auto w-full max-w-[1200px]">
    <form class="w-full max-w-[700px] mx-auto" @submit.prevent="onSubmit">
      <PrimeCard
        :pt="{
          root: {
            class: 'border-none shadow-none',
          },
        }"
      >
        <template #title> Create Your Account </template>

        <template #subtitle>
          Join us by creating your account! Unlock a world of possibilities and
          exclusive features. Fill in the required information to start your
          personalized journey with us.
        </template>

        <template #content>
          <div class="flex flex-row w-full flex-nowrap gap-x-2">
            <UserFirstNameInput
              v-model:first-name="firstName"
              :error-message="validationErrors.firstName"
              class="w-full"
            />

            <UserNameInput
              v-model:name="name"
              :error-message="validationErrors.name"
              class="w-full"
            />
          </div>

          <UserUsernameInput
            v-model:username="username"
            :error-message="validationErrors.username"
            class="w-full"
          />

          <EmailInput
            v-model:email="email"
            :error-message="validationErrors.email"
            class="w-full"
          />

          <PasswordInput
            v-model:password="password"
            :error-message="validationErrors.password"
            class="w-full"
          />
        </template>

        <template #footer>
          <div
            class="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center"
          >
            <PrimeButton
              type="submit"
              label="Register"
              icon="pi pi-user-plus"
              :loading="isSubmitting"
            />

            <NuxtLink
              :to="{
                name: 'signin',
              }"
              class="text-primary hover:underline"
            >
              Already have an account? Sign in
            </NuxtLink>
          </div>
        </template>
      </PrimeCard>
    </form>

    <ConfirmDialog
      v-model:is-visible="isRegisterSuccess"
      modal
      :header="'Registration Success!\nPlease Confirm Your Account'"
      :message="message"
      severity="success"
      icon-type="check"
      :is-closable="true"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});

const toast = useToast();

const message: string = [
  "Congratulations! Your registration was successful.",
  "To activate your account and complete the registration process, we have sent a confirmation link to the email address you provided!",
  "Please check your inbox and click on the link to verify your account.",
  "If you don't see the email, please check your spam folder.",
  "Thank you for choosing us, and we look forward to having you as part of our community!",
].join("\n");

const fatalError = ref<null | string>(null);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: toTypedSchema(StoreRegisterBodySchema),
});
const [name] = defineField("name");
const [firstName] = defineField("firstName");
const [email] = defineField("email");
const [username] = defineField("username");
const [password] = defineField("password");

const isRegisterSuccess = ref<boolean>(false);

const { error: fetchError, execute: storeRegister } = useStoreRegister({
  body: () => ({
    name: name.value!,
    firstName: firstName.value!,
    email: email.value!,
    username: username.value!,
    password: password.value!,
  }),
});

const onSubmit = handleSubmit(async () => {
  fatalError.value = null;
  await storeRegister();

  if (fetchError.value === null) {
    fatalError.value = null;
    isRegisterSuccess.value = true;
    resetForm();
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
</script>
