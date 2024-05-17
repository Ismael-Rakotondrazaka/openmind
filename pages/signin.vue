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
        <template #title>Sign In to Your Account</template>

        <template #subtitle>
          Sign in to access your account and enjoy personalized features. Enter
          your credentials to securely connect and make the most of our
          services.
        </template>

        <template #content>
          <EmailOrUsernameInput
            v-model:email-or-username="emailOrUsername"
            :is-required="true"
            :error-message="errors.usernameOrEmail"
          />

          <PasswordInput
            v-model:password="password"
            :is-required="true"
            :error-message="errors.password"
          />
        </template>

        <template #footer>
          <PrimeButton
            type="submit"
            icon="pi pi-sign-in"
            label="Submit"
            :loading="isSubmitting"
          />
        </template>
      </PrimeCard>
    </form>

    <PrimeToast position="top-right" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});

const { signIn } = useAuth();
const toast = useToast();

const fatalError = ref<null | string>(null);

const { errors, defineField, handleSubmit, resetForm, isSubmitting } = useForm({
  validationSchema: toTypedSchema(StoreLoginBodySchema),
});
const [emailOrUsername] = defineField("usernameOrEmail");
const [password] = defineField("password");

const onSubmit = handleSubmit(async (values: StoreLoginBody) => {
  // ! See https://github.com/nextauthjs/next-auth/blob/bcb9383aecaee490ba0c4979f3d0f5b0457924a3/src/server/pages/signin.js#L23-L36
  type ErrorType =
    | "Signin"
    | "OAuthSignin"
    | "OAuthCallback"
    | "OAuthCreateAccount"
    | "EmailCreateAccount"
    | "Callback"
    | "OAuthAccountNotLinked"
    | "EmailSignin"
    | "CredentialsSignin"
    | "SessionRequired";

  const errors: Record<ErrorType | "default", string> = {
    Signin: "Try signing in with a different account.",
    OAuthSignin: "Try signing in with a different account.",
    OAuthCallback: "Try signing in with a different account.",
    OAuthCreateAccount: "Try signing in with a different account.",
    EmailCreateAccount: "Try signing in with a different account.",
    Callback: "Try signing in with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email inbox.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    SessionRequired: "Veuillez vous connecter pour cette page.",
    default: "Unable to sign in.",
  };

  const {
    error: errorType,
    url,
  }: { error: ErrorType; url: null } | { error: null; url: string } =
    await signIn("credentials", {
      ...values,
      callbackUrl: authConfig.AUTHENTICATED_PATH,
      redirect: false,
    });

  if (errorType !== null) {
    fatalError.value = errorType && (errors[errorType] ?? errors.default);

    toast.add({
      severity: "error",
      detail: fatalError.value,
      summary: errorConfig.DEFAULT_BAD_REQUEST_ERROR_MESSAGE,
      life: notificationConfig.LIFE,
    });
  } else {
    fatalError.value = null;
    resetForm();
    navigateTo(url, { external: true });
  }
});
</script>
