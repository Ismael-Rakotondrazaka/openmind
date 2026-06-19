<script setup lang="ts">
import { useQueryCache } from '@pinia/colada';
import { authErrorCodeMessageMap } from '~~/shared/utils/errors';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';

const ConfirmStatus = {
  failed: 'failed',
  processing: 'processing',
  success: 'success',
} as const;

type ConfirmSuccess = (typeof ConfirmStatus)[keyof typeof ConfirmStatus];

const status = ref<ConfirmSuccess>(ConfirmStatus.processing);
const errorCode = ref<string | undefined>();
const resendEmail = ref('');
const resendSent = ref(false);
const isResending = ref(false);

const route = useRoute('confirm');
const { t } = useI18n();

const { fetch: fetchSession } = useUserSession();

const title = computed(() => t(`auth.confirm.title.${status.value}`));

const description = computed(() =>
  errorCode.value
    ? (authErrorCodeMessageMap[errorCode.value] ??
      t('auth.confirm.description.failed'))
    : t(`auth.confirm.description.${status.value}`)
);

const queryCache = useQueryCache();
const localePath = useLocalePath();

const handleResend = async () => {
  if (!resendEmail.value) return;
  isResending.value = true;
  try {
    await $fetch('/api/auth/confirm/resend', {
      body: { email: resendEmail.value },
      method: 'POST',
    });
    resendSent.value = true;
  } finally {
    isResending.value = false;
  }
};

onMounted(async () => {
  const token = route.query.token;
  if (typeof token !== 'string' || !token) {
    errorCode.value = t('auth.confirm.errors.invalidToken');
    status.value = ConfirmStatus.failed;
    return;
  }

  try {
    await $fetch('/api/auth/confirm', { query: { token } });
    await fetchSession();
    status.value = ConfirmStatus.success;
    queryCache.invalidateQueries({ key: ['auth-user'] });
    setTimeout(() => navigateTo(localePath({ name: 'index' })), 2000);
  } catch (err: unknown) {
    const msg = (err as { data?: { message?: string } })?.data?.message;
    errorCode.value = msg ?? t('auth.confirm.errors.invalidToken');
    status.value = ConfirmStatus.failed;
  }
});
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

        <div
          v-if="status === ConfirmStatus.failed && !resendSent"
          class="mt-4 flex flex-col gap-2"
        >
          <p class="text-muted-foreground text-sm">
            {{ t('auth.confirm.resend.label') }}
          </p>
          <Input
            v-model="resendEmail"
            type="email"
            :placeholder="t('auth.confirm.resend.placeholder')"
          />
          <Button :disabled="isResending || !resendEmail" @click="handleResend">
            {{
              isResending
                ? t('auth.confirm.resend.sending')
                : t('auth.confirm.resend.button')
            }}
          </Button>
        </div>

        <p v-if="resendSent" class="text-muted-foreground mt-4 text-sm">
          {{ t('auth.confirm.resend.success') }}
        </p>
      </Empty>
    </div>
  </div>
</template>
