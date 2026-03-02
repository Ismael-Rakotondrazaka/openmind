<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
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
import { PasswordUpdateBodySchema } from '@/features/auth/auth.schema';
import { useUpdateAuthUserPassword } from '@/features/auth/composables/useUpdateAuthUserPassword';

const ChangePasswordBodySchema = PasswordUpdateBodySchema.extend({
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(values => values.password === values.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    confirmPassword: '',
    password: '',
  },
  validationSchema: toTypedSchema(ChangePasswordBodySchema),
});

const updateAuthUserPasswordMutation = useUpdateAuthUserPassword();

const onSubmit = handleSubmit(async values => {
  try {
    await updateAuthUserPasswordMutation.mutateAsync(values.password);
    resetForm({ values: { confirmPassword: '', password: '' } });
    toast.success('Password updated successfully');
  } catch {
    toast.error('Failed to update password');
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Change Password</CardTitle>
      <CardDescription>
        Update your account password. Use at least 8 characters.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="password" method="POST" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="password">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="password">New password</FieldLabel>
              <Input
                id="password"
                :model-value="field.value"
                type="password"
                autocomplete="new-password"
                :aria-invalid="!!errors.length"
                @update:model-value="field.onChange"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <VeeField v-slot="{ field, errors }" name="confirmPassword">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="confirmPassword">Confirm password</FieldLabel>
              <Input
                id="confirmPassword"
                :model-value="field.value"
                type="password"
                autocomplete="new-password"
                :aria-invalid="!!errors.length"
                @update:model-value="field.onChange"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <Field>
            <Button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Updating password...' : 'Update password' }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
