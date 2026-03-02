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
import { PasswordUpdateBodySchema } from '@/features/auth/auth.schema';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const supabase = useSupabaseClient();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    password: '',
  },
  validationSchema: toTypedSchema(PasswordUpdateBodySchema),
});

const updateUserPassword = handleSubmit(async values => {
  const { error } = await supabase.auth.updateUser({
    password: values.password,
  });

  if (error) {
    toast.error(getAuthErrorMessage(error));
    return;
  }

  toast.success('Password updated successfully.');
  resetForm();

  await navigateTo({
    name: 'index',
  });
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Set your new password</CardTitle>
        <CardDescription>
          Choose a strong new password to secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="password-update" method="POST" @submit="updateUserPassword">
          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="password">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="password">New password</FieldLabel>
                <Input
                  id="password"
                  v-bind="field"
                  type="password"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Updating password...' : 'Update password' }}
              </Button>
              <FieldDescription class="text-center">
                Back to
                <NuxtLink to="login">Login</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
