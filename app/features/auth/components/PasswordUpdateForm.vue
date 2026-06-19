<script setup lang="ts">
import type { FetchError } from 'ofetch';
import type { HTMLAttributes } from 'vue';

import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordUpdateBodySchema } from '@/features/auth/auth.schema';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const route = useRoute();
const localeRoute = useLocaleRoute();
const { t } = useI18n();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    password: '',
  },
  validationSchema: toTypedSchema(PasswordUpdateBodySchema),
});

const updateUserPassword = handleSubmit(async values => {
  const loginRoute = localeRoute({ name: 'login' });

  const token = route.query.token;
  if (typeof token !== 'string') {
    toast.error(t('auth.passwordUpdate.invalidLink'));
    return;
  }

  try {
    await $fetch('/api/auth/password/reset/confirm', {
      body: { password: values.password, token },
      method: 'POST',
    });
    toast.success(t('toasts.password.updated'));
    resetForm();
    await navigateTo(loginRoute);
  } catch (error: unknown) {
    const msg = (error as FetchError)?.data?.message ?? 'errors.default';
    toast.error(getAuthErrorMessage({ code: msg, message: msg }));
  }
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('auth.passwordUpdate.title') }}</CardTitle>
        <CardDescription>
          {{ t('auth.passwordUpdate.description') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="password-update" method="POST" @submit="updateUserPassword">
          <FieldGroup>
            <VeeField v-slot="{ errors, componentField }" name="password">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="password">{{
                  t('auth.passwordUpdate.newPasswordLabel')
                }}</FieldLabel>
                <Input
                  id="password"
                  v-bind="componentField"
                  type="password"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{
                  isSubmitting
                    ? t('loading.changingPassword')
                    : t('buttons.changePassword')
                }}
              </Button>
              <FieldDescription class="text-center">
                {{ t('auth.passwordReset.remembered') }}
                <NuxtLinkLocale :to="{ name: 'login' }">{{
                  t('buttons.login')
                }}</NuxtLinkLocale>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
