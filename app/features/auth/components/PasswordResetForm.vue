<script setup lang="ts">
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
import { PasswordResetBodySchema } from '@/features/auth/auth.schema';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: toTypedSchema(PasswordResetBodySchema),
});

const requestResetPassword = handleSubmit(async values => {
  try {
    await $fetch('/api/auth/password/reset', {
      body: { email: values.email },
      method: 'POST',
    });
    toast.success(t('toasts.password.resetEmailSent'));
    resetForm();
  } catch {
    toast.error(t('toasts.password.failedToSendResetEmail'));
  }
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('auth.passwordReset.title') }}</CardTitle>
        <CardDescription>
          {{ t('auth.passwordReset.description') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="password-reset" method="POST" @submit="requestResetPassword">
          <FieldGroup>
            <VeeField v-slot="{ errors, componentField }" name="email">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="email">{{
                  t('forms.fields.email.label')
                }}</FieldLabel>
                <Input
                  id="email"
                  v-bind="componentField"
                  type="email"
                  :placeholder="t('forms.fields.email.placeholder')"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{
                  isSubmitting
                    ? t('loading.sendingResetLink')
                    : t('buttons.sendResetLink')
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
