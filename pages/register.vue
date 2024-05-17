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
          <PrimeButton
            type="submit"
            label="Register"
            icon="pi pi-user-plus"
            :loading="isSubmitting"
          />
        </template>
      </PrimeCard>
    </form>

    <PrimeDialog
      v-model:visible="isRegisterSuccess"
      modal
      header="Registration Success! Please Confirm Your Account"
      :style="{ width: '50rem' }"
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <p>
        Congratulations! Your registration was successful. To activate your
        account and complete the registration process, we have sent a
        confirmation link to the email address you provided. Please check your
        inbox and click on the link to verify your account. If you don't see the
        email, please check your spam folder. Thank you for choosing us, and we
        look forward to having you as part of our community!
      </p>
    </PrimeDialog>
    <PrimeToast position="top-right" />
  </div>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});

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
  validationSchema: toTypedSchema(StoreRegisterBodySchema),
});
const [name] = defineField("name");
const [firstName] = defineField("firstName");
const [email] = defineField("email");
const [username] = defineField("username");
const [password] = defineField("password");

const isRegisterSuccess = ref<boolean>(false);

const { error: fetchError, execute: storeRegister } = useFetch<
  StoreRegisterData,
  FetchError<StoreRegisterError>
>("/api/register", {
  method: "POST",
  body: {
    name,
    firstName,
    email,
    username,
    password,
  },
  immediate: false,
  watch: false,
});

const onSubmit = handleSubmit(async () => {
  fatalError.value = null;
  await storeRegister();

  if (fetchError.value === null) {
    fatalError.value = null;
    isRegisterSuccess.value = true;
    resetForm();
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
</script>
