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
        <template #title>
          <h1 class="">Password Reset Request</h1>
        </template>

        <template #subtitle>
          <p class="">
            Enter your email address or username to receive a password reset
            link.
          </p>
        </template>

        <template #content>
          <EmailOrUsernameInput
            v-model:emailOrUsername="emailOrUsername"
            :error-message="validationErrors.emailOrUsername"
            class="w-full"
          />
        </template>

        <template #footer>
          <PrimeButton
            type="submit"
            label="Send Reset Link"
            icon="pi pi-envelope"
            :loading="isSubmitting"
          />
        </template>
      </PrimeCard>
    </form>

    <ConfirmDialog
      v-model:visible="isPasswordResetRequestSuccess"
      modal
      header="Password Reset Link Sent"
      message="Congratulations! Your password reset link was sent successfully. Please check your email inbox and follow the instructions to reset your password."
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

const fatalError = ref<null | string>(null);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
} = useForm({
  validationSchema: toTypedSchema(StorePasswordResetRequestBodySchema),
});
const [emailOrUsername] = defineField("emailOrUsername");

const isPasswordResetRequestSuccess = ref<boolean>(false);

const { error: fetchError, execute: storePasswordResetRequest } =
  useStorePasswordResetRequest({
    body: () => ({
      emailOrUsername: emailOrUsername.value!,
    }),
  });

const onSubmit = handleSubmit(async () => {
  fatalError.value = null;
  await storePasswordResetRequest();

  if (fetchError.value === null) {
    fatalError.value = null;
    isPasswordResetRequestSuccess.value = true;
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
