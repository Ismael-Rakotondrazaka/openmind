<script setup lang="ts">
import type { FetchError } from 'ofetch';
import type { HTMLAttributes } from 'vue';

import { useQuery } from '@pinia/colada';
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
import { usernameExistsQuery } from '@/features/auth/auth.query';
import { RegisterBodySchema } from '@/features/auth/auth.schema';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const { t } = useI18n();

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

const fetchFn = useRequestFetch();

const usernameToCheck = ref('');
const { refetch: checkUsernameExists } = useQuery(() =>
  usernameExistsQuery({ fetchFn, username: usernameToCheck.value })
);

const showConfirmEmailModal = ref(false);

const createMessageHandler = handleSubmit(async values => {
  usernameToCheck.value = values.username ?? '';

  const { data: isUsernameExists, error: usernameExistsError } =
    await checkUsernameExists();

  if (usernameExistsError) {
    toast.error(t('auth.register.form.unableToValidateUsername'));
    return;
  }

  if (isUsernameExists) {
    setFieldError('username', t('auth.register.form.usernameAlreadyExists'));
    return;
  }

  try {
    await $fetch('/api/auth/register', { body: values, method: 'POST' });

    setTimeout(() => {
      resetForm();
    }, 3000);
    showConfirmEmailModal.value = true;
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
        <CardTitle>{{ t('auth.register.form.createAccountTitle') }}</CardTitle>
        <CardDescription>
          {{ t('auth.register.form.createAccountDescription') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register" method="POST" @submit="createMessageHandler">
          <FieldGroup>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <VeeField v-slot="{ errors, componentField }" name="firstName">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="firstName">{{
                    t('users.firstName')
                  }}</FieldLabel>
                  <Input
                    id="firstName"
                    v-bind="componentField"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>

              <VeeField v-slot="{ errors, componentField }" name="lastName">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="lastName">{{
                    t('users.lastName')
                  }}</FieldLabel>
                  <Input
                    id="lastName"
                    v-bind="componentField"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </div>

            <VeeField v-slot="{ errors, componentField }" name="username">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="username">{{
                  t('users.username')
                }}</FieldLabel>
                <Input
                  id="username"
                  v-bind="componentField"
                  :placeholder="t('users.usernamePlaceholder')"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ errors, componentField }" name="email">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="email">{{
                  t('forms.fields.email.label')
                }}</FieldLabel>
                <Input
                  id="email"
                  v-bind="componentField"
                  :placeholder="t('forms.fields.email.placeholder')"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <VeeField v-slot="{ errors, componentField }" name="password">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="password">{{
                  t('forms.fields.password.label')
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
                {{ isSubmitting ? t('loading.creating') : t('buttons.create') }}
              </Button>
              <FieldDescription class="text-center">
                {{ t('auth.register.form.alreadyHaveAccount') }}
                <NuxtLinkLocale :to="{ name: 'login' }">{{
                  t('buttons.login')
                }}</NuxtLinkLocale>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <ResponsiveModal v-model:open="showConfirmEmailModal">
      <template #title>
        <h2 class="text-2xl font-bold">
          {{ t('auth.register.form.confirmEmailTitle') }}
        </h2>
      </template>
      <template #description>
        <p class="text-sm text-gray-500">
          {{ t('auth.register.form.confirmEmailDescription') }}
        </p>
      </template>
      <template #close>
        <Button variant="outline">{{ t('buttons.close') }}</Button>
      </template>
    </ResponsiveModal>
  </div>
</template>
