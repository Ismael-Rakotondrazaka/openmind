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

const supabase = useSupabaseClient();
const config = useRuntimeConfig();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: toTypedSchema(PasswordResetBodySchema),
});

const requestResetPassword = handleSubmit(async values => {
  const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
    redirectTo: `${config.public.appUrl}/password/update`,
  });

  if (error) {
    toast.error(getAuthErrorMessage(error));
    return;
  }

  toast.success('Password reset email sent. Check your inbox.');
  resetForm();
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter your account email and we’ll send you a secure link to set a new
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="password-reset" method="POST" @submit="requestResetPassword">
          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="email">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="email">Email</FieldLabel>
                <Input
                  id="email"
                  v-bind="field"
                  type="email"
                  placeholder="email@example.com"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Sending reset link...' : 'Send reset link' }}
              </Button>
              <FieldDescription class="text-center">
                Remembered your password?
                <NuxtLink to="login">Login</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
