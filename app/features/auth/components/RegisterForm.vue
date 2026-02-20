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
import { RegisterBodySchema } from '@/features/auth/auth.schema';
import { useIsUsernameExists } from '@/features/auth/composables/useIsUsernameExists';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({
  initialValues: {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
  },
  validationSchema: toTypedSchema(RegisterBodySchema),
});

const userSBClient = useSupabaseClient();
const config = useRuntimeConfig();
const usernameToCheck = ref('');
const usernameExistsQuery = useIsUsernameExists({
  get username() {
    return usernameToCheck.value;
  },
});

const showConfirmEmailModal = ref(true);

const createMessageHandler = handleSubmit(async values => {
  usernameToCheck.value = values.username;

  const { data: isUsernameExists, error: usernameExistsError } =
    await usernameExistsQuery.refetch();

  if (usernameExistsError) {
    toast.error('Unable to validate username uniqueness right now.');
    return;
  }

  if (isUsernameExists) {
    setFieldError('username', 'Username already exists');
    return;
  }

  const { error } = await userSBClient.auth.signUp({
    email: values.email,
    options: {
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        username: values.username,
      },
      emailRedirectTo: `${config.public.appUrl}/confirm`,
    },
    password: values.password,
  });

  if (error) {
    toast.error(getAuthErrorMessage(error));
    return;
  }

  setTimeout(() => {
    resetForm();
  }, 3000);

  showConfirmEmailModal.value = true;
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Join us by creating your account! Unlock a world of possibilities and
          exclusive features. Fill in the required information to start your
          personalized journey with us.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register" method="POST" @submit="createMessageHandler">
          <FieldGroup>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <VeeField v-slot="{ field, errors }" name="firstName">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="firstName">First name</FieldLabel>
                  <Input
                    id="firstName"
                    v-bind="field"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>

              <VeeField v-slot="{ field, errors }" name="lastName">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="lastName">Last name</FieldLabel>
                  <Input
                    id="lastName"
                    v-bind="field"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>

            <VeeField v-slot="{ field, errors }" name="username">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="username">Username</FieldLabel>
                <Input
                  id="username"
                  v-bind="field"
                  placeholder="yourusername"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

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

            <VeeField v-slot="{ field, errors }" name="password">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="password">Password</FieldLabel>
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
                {{ isSubmitting ? 'Creating account...' : 'Create account' }}
              </Button>
              <FieldDescription class="text-center">
                Already have an account?
                <NuxtLink to="login">Login</NuxtLink>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <ResponsiveModal v-model:open="showConfirmEmailModal">
      <template #title>
        <h2 class="text-2xl font-bold">Confirm your email</h2>
      </template>
      <template #description>
        <p class="text-sm text-gray-500">
          We've sent you a confirmation email. Please check your inbox and click
          the link to confirm your email address.
        </p>
      </template>
      <template #close>
        <Button variant="outline">Close</Button>
      </template>
    </ResponsiveModal>
  </div>
</template>
