<template>
  <div class="flex items-center justify-center h-screen p-5 bg-sky-50">
    <form class="w-full max-w-xl" @submit.prevent="onSubmit">
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
              <label for="name">Name</label>
              <PrimeInputText
                id="name"
                v-model="name"
                :class="{ 'p-invalid': validationErrors.name }"
              />
              <small id="email-or-username-text-error" class="text-red-600">{{
                validationErrors.name || "&nbsp;"
              }}</small>
            </div>

            <div class="flex gap-2 flex-col w-full">
              <label for="firstName">First name</label>
              <PrimeInputText
                id="firstName"
                v-model="firstName"
                :class="{ 'p-invalid': validationErrors.firstName }"
              />
              <small id="email-or-username-text-error" class="text-red-600">{{
                validationErrors.firstName || "&nbsp;"
              }}</small>
            </div>
          </div>

          <div class="flex gap-2 flex-col">
            <label for="username">Username</label>
            <PrimeInputText
              id="username"
              v-model="username"
              :class="{ 'p-invalid': validationErrors.username }"
            />
            <small id="username-text-error" class="text-red-600">{{
              validationErrors.username || "&nbsp;"
            }}</small>
          </div>

          <div class="flex gap-2 flex-col">
            <label for="email">Email</label>
            <PrimeInputText
              id="email"
              v-model="email"
              type="email"
              :class="{ 'p-invalid': validationErrors.email }"
            />
            <small id="email-text-error" class="text-red-600">{{
              validationErrors.email || "&nbsp;"
            }}</small>
          </div>

          <div class="flex gap-2 flex-col">
            <label for="email">Password</label>
            <PrimePassword
              id="password"
              v-model="password"
              :input-class="{
                '!p-invalid': validationErrors.password,
                'w-full': true,
              }"
              toggle-mask
              :feedback="false"
              :class="{ 'p-invalid': validationErrors.password }"
            />
            <small id="password-text-error" class="text-red-600">{{
              validationErrors.password || "&nbsp;"
            }}</small>
          </div>
        </template>

        <template #footer>
          <PrimeButton type="submit" label="Submit" :loading="isSubmitting" />
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
import { FetchError } from "ofetch";

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
  validationSchema: toTypedSchema(storeRegisterBodySchema),
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
      life: 5000,
    });
  }
});
</script>
