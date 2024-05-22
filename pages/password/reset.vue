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
          <PasswordInput
            v-model:password="password"
            :error-message="validationErrors.password"
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

defineOgImageComponent("DefaultOgImage");

const toast = useToast();

const fatalError = ref<null | string>(null);

const {
  errors: validationErrors,
  defineField,
  handleSubmit,
  resetForm,
  isSubmitting,
  setErrors,
  setFieldValue,
} = useForm({
  validationSchema: toTypedSchema(StorePasswordResetBodySchema),
});
const [password] = defineField("password");

const route = useRoute("password-reset");

const tValue = computed<string>(() => {
  let result = "";

  if (Array.isArray(route.query.t)) {
    result = route.query.t[0] ?? "";
  } else {
    result = route.query.t ?? "";
  }

  return result;
});

watch(
  tValue,
  (newValue) => {
    setFieldValue("t", newValue);
  },
  {
    immediate: true,
  },
);

const { error: fetchError, execute: storePasswordReset } =
  useStorePasswordReset({
    body: () => ({
      password: password.value!,
      t: tValue.value,
    }),
  });

const onSubmit = handleSubmit(async () => {
  fatalError.value = null;
  await storePasswordReset();

  if (fetchError.value === null) {
    fatalError.value = null;
    resetForm();

    toast.add({
      severity: "success",
      summary: "Password Reset",
      detail: "Your password has been reset successfully",
      life: notificationConfig.LIFE,
    });

    navigateTo({
      name: "signin",
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
</script>
