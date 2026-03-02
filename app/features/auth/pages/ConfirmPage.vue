<script></script>

<script setup lang="ts">
import { authErrorCodeMessageMap } from '~~/shared/utils/errors';

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';

const ConfirmStatus = {
  failed: 'failed',
  processing: 'processing',
  success: 'success',
} as const;

type ConfirmSuccess = (typeof ConfirmStatus)[keyof typeof ConfirmStatus];
const user = useSupabaseUser();
const redirectInfo = useSupabaseCookieRedirect();

const status = ref<ConfirmSuccess>(ConfirmStatus.processing);

const route = useRoute('confirm');

const titleMap: Record<ConfirmSuccess, string> = {
  [ConfirmStatus.failed]: 'Error encountered',
  [ConfirmStatus.processing]: 'Confirming your email',
  [ConfirmStatus.success]: 'Email confirmed',
};

const title = computed(() => titleMap[status.value]);

const errorCode = ref<string | undefined>();

const descriptionMap: Record<ConfirmSuccess, string> = {
  [ConfirmStatus.failed]: 'Could not confirm.',
  [ConfirmStatus.processing]:
    'Please wait while we confirm your email. Do not refresh the page.',
  [ConfirmStatus.success]: 'Your email has been confirmed. Redirecting...',
};

const description = computed(() =>
  errorCode.value
    ? (authErrorCodeMessageMap[errorCode.value] ?? 'Could not confirm.')
    : descriptionMap[status.value]
);

onMounted(() => {
  setTimeout(() => {
    if (typeof route.query.error_code === 'string') {
      errorCode.value = route.query.error_code;
      status.value = ConfirmStatus.failed;
    }
  }, 3000);
});

const queryClient = useQueryClient();
const supabase = useSupabaseClient();

const refreshAuthUserData = () => {
  // Supabase client does not automatically update the user data after email confirmation
  supabase.auth.refreshSession();
  queryClient.invalidateQueries({ queryKey: ['auth-user'] });
};

watch(
  user,
  () => {
    if (user.value) {
      setTimeout(() => {
        status.value = ConfirmStatus.success;

        refreshAuthUserData();

        setTimeout(() => {
          // Get redirect path, and clear it from the cookie
          const path = redirectInfo.pluck();
          // Redirect to the saved path, or fallback to home
          return navigateTo(path || '/');
        }, 3000);
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
            <Spinner v-if="status === ConfirmStatus.processing" />
            <Icon
              v-else-if="status === ConfirmStatus.success"
              name="mdi:check"
              size="1rem"
              class="text-primary"
            />
            <Icon
              v-else-if="status === ConfirmStatus.failed"
              name="mdi:close-circle-outline"
              size="1rem"
              class="text-destructive"
            />
          </EmptyMedia>
          <EmptyTitle>{{ title }}</EmptyTitle>
          <EmptyDescription>
            {{ description }}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  </div>
</template>
