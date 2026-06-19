<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
import { z } from 'zod';

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUpdateAuthUserPassword } from '@/features/auth/auth.query';
import { PasswordUpdateBodySchema } from '@/features/auth/auth.schema';

const { t } = useI18n();

const ChangePasswordBodySchema = PasswordUpdateBodySchema.extend({
  confirmPassword: z.string().min(8),
}).refine(values => values.password === values.confirmPassword, {
  message: t('users.passwordsDoNotMatch'),
  path: ['confirmPassword'],
});

// Custom validator with translation for password min length
const validatePasswordMinLength = (password: string): string | undefined => {
  if (password.length < 8) {
    return t('users.passwordMinLength');
  }
  return undefined;
};

const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({
  initialValues: {
    confirmPassword: '',
    password: '',
  },
  validationSchema: toTypedSchema(ChangePasswordBodySchema),
});

const updateAuthUserPasswordMutation = useMutation(useUpdateAuthUserPassword());

const onSubmit = handleSubmit(async values => {
  // Validate password min length with translation
  const passwordError = validatePasswordMinLength(values.password);
  if (passwordError) {
    setFieldError('password', passwordError);
    return;
  }

  const confirmPasswordError = validatePasswordMinLength(
    values.confirmPassword
  );
  if (confirmPasswordError) {
    setFieldError('confirmPassword', confirmPasswordError);
    return;
  }

  try {
    await updateAuthUserPasswordMutation.mutateAsync({
      password: values.password,
    });
    resetForm({ values: { confirmPassword: '', password: '' } });
    toast.success(t('toasts.password.updated'));
  } catch {
    toast.error(t('toasts.password.failedToUpdate'));
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>{{ t('users.changePassword') }}</CardTitle>
      <CardDescription>
        {{ t('users.changePasswordDescription') }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="password" method="POST" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ errors, componentField }" name="password">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="password">{{
                t('users.newPassword')
              }}</FieldLabel>
              <Input
                id="password"
                v-bind="componentField"
                type="password"
                autocomplete="new-password"
                :aria-invalid="!!errors.length"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ errors, componentField }" name="confirmPassword">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="confirmPassword">{{
                t('users.confirmPassword')
              }}</FieldLabel>
              <Input
                id="confirmPassword"
                v-bind="componentField"
                type="password"
                autocomplete="new-password"
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
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
