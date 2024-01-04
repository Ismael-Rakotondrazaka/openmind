<template>
  <div class="flex items-center justify-center h-screen p-5 bg-sky-50">
    <form class="w-full max-w-lg" @submit.prevent="onSubmit">
      <PrimeCard>
        <template #title> Sign In to Your Account </template>

        <template #subtitle>
          Sign in to access your account and enjoy personalized features. Enter
          your credentials to securely connect and make the most of our
          services.
        </template>

        <template #content>
          <div class="flex gap-2 flex-col">
            <label for="emailOrUsername">Username or email</label>
            <PrimeInputText
              id="emailOrUsername"
              v-model="emailOrUsername"
              :class="{ 'p-invalid': errors.usernameOrEmail }"
            />
            <small id="email-or-username-text-error" class="text-red-600">{{
              errors.usernameOrEmail || "&nbsp;"
            }}</small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="password">Password</label>
            <PrimePassword
              id="password"
              v-model="password"
              :input-class="{ '!p-invalid': errors.password, 'w-full': true }"
              toggle-mask
              :feedback="false"
              :class="{ 'p-invalid': errors.password }"
            />
            <small id="password-text-error" class="text-red-600">{{
              errors.password || "&nbsp;"
            }}</small>
          </div>
        </template>

        <template #footer>
          <PrimeButton type="submit" label="Submit" :loading="isSubmitting" />
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
  validationSchema: toTypedSchema(storeLoginBodySchema),
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
      life: 5000,
    });
  } else {
    fatalError.value = null;
    resetForm();
    navigateTo(url, { external: true });
  }
});
</script>
