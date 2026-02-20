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
import { LoginBodySchema } from '@/features/auth/auth.schema';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: toTypedSchema(LoginBodySchema),
});

const userSBClient = useSupabaseClient();
const redirectInfo = useSupabaseCookieRedirect();

const createMessageHandler = handleSubmit(async values => {
  const { error } = await userSBClient.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    toast.error(getAuthErrorMessage(error));
    return;
  }

  toast.success('Login successful');

  setTimeout(() => {
    resetForm();
  }, 3000);

  const path = redirectInfo.pluck();
  navigateTo(path || '/');
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Sign in to access your account and enjoy personalized features. Enter
          your credentials to securely connect and make the most of our
          services.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login" method="POST" @submit="createMessageHandler">
          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="email">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="email">Email</FieldLabel>
                <Input
                  id="email"
                  v-bind="field"
                  placeholder="email@example.com"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <Field>
              <FieldLabel for="email"> Email </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel for="password"> Password </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </Field>
            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Logging in...' : 'Login' }}
              </Button>
              <FieldDescription class="text-center">
                Don't have an account?
                <NuxtLink to="register">Sign up</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
