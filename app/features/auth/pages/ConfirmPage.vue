<script setup lang="ts">
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

watch(
  user,
  () => {
    if (user.value) {
      setTimeout(() => {
        // Get redirect path, and clear it from the cookie
        const path = redirectInfo.pluck();
        // Redirect to the saved path, or fallback to home
        return navigateTo(path || '/feed');
      }, 3000);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm">
      <Empty class="w-full">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
          <EmptyTitle>Confirming your email</EmptyTitle>
          <EmptyDescription>
            Please wait while we confirm your email. Do not refresh the page.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  </div>
</template>
