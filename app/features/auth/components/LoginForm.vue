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
import { LoginBodySchema } from '@/features/auth/auth.schema';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const route = useRoute();

const localeRoute = useLocaleRoute();

const { fetch: fetchSession } = useUserSession();

const { t } = useI18n();

const { handleSubmit, isSubmitting, resetForm } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: toTypedSchema(LoginBodySchema),
});

const handleLogin = handleSubmit(async values => {
  try {
    await $fetch('/api/auth/login', { body: values, method: 'POST' });
    await fetchSession();

    toast.success(t('auth.signIn.form.success'));
    setTimeout(() => {
      resetForm();
    }, 3000);

    if (route.query.redirect) {
      await navigateTo(route.query.redirect as string);
    } else {
      await navigateTo(localeRoute({ name: 'index' }));
    }
  } catch (error: unknown) {
    const msg =
      (error as FetchError)?.data?.message ??
      'auth.signIn.form.errors.credentials.notMatch';
    toast.error(getAuthErrorMessage({ code: msg, message: msg }));
  }
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('auth.login.title') }}</CardTitle>
        <CardDescription>
          {{ t('auth.login.description') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login" method="POST" @submit.prevent="handleLogin">
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

            <VeeField v-slot="{ errors, componentField }" name="password">
              <Field :data-invalid="!!errors.length">
                <div class="flex items-center">
                  <FieldLabel for="password">{{
                    t('forms.fields.password.label')
                  }}</FieldLabel>
                  <NuxtLinkLocale
                    :to="{ name: 'password-reset' }"
                    class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {{ t('auth.signIn.form.forgotPassword') }}
                  </NuxtLinkLocale>
                </div>
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
                {{ isSubmitting ? t('loading.signingIn') : t('buttons.login') }}
              </Button>
              <FieldDescription class="text-center">
                {{ t('auth.register.form.dontHaveAccount') }}
                <NuxtLinkLocale :to="{ name: 'register' }">
                  {{ t('buttons.signup') }}
                </NuxtLinkLocale>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
