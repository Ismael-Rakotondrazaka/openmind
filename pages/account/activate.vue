<template>
  <div class="mx-auto w-full max-w-[1200px]">
    <form
      class="w-full max-w-[700px] mx-auto"
      @submit.prevent="onActivateAccountHandler"
    >
      <PrimeCard
        :pt="{
          root: {
            class: 'border-none shadow-none',
          },
        }"
      >
        <template #title>Activating your account</template>

        <template #subtitle>
          <p>Activate your account to unlock personalized features.</p>
          <p>
            After activation, you'll be able to create articles, and comment
            them.
          </p>
        </template>

        <template #footer>
          <PrimeButton
            icon="pi pi-refresh"
            label="Retry"
            type="submit"
            :loading="isStatusPending"
          />
        </template>
      </PrimeCard>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: authConfig.AUTHENTICATED_PATH,
  },
});

const route = useRoute("account-activate");

const toast = useToast();

const tValue = computed<{
  t: string;
}>(() => {
  const result = {
    t: "",
  };

  if (Array.isArray(route.query.t)) {
    result.t = route.query.t[0] ?? "";
  } else {
    result.t = route.query.t ?? "";
  }

  return result;
});

const {
  error,
  execute: activateAccount,
  isStatusPending,
} = useStoreActivateAccount({
  body: tValue,
});

const onActivateAccountHandler = async () => {
  await activateAccount();

  if (error.value !== null) {
    toast.add({
      severity: "error",
      summary: error.value.message,
      detail: error.value.errorMessage.t,
      life: notificationConfig.LIFE,
    });
  } else {
    toast.add({
      severity: "success",
      summary: "Account activated",
      detail: "You can now access your account",
      life: notificationConfig.LIFE,
    });

    navigateTo({
      name: "signin",
    });
  }
};

onMounted(async () => {
  await onActivateAccountHandler();
});
</script>
