<template>
  <div class="h-full w-full">
    <Card>
      <CardHeader>
        <CardTitle>{{ t('users.changeEmail') }}</CardTitle>
        <CardDescription>
          {{ t('users.changeEmailDescription') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="email" method="POST" @submit="onSubmit">
          <FieldGroup>
            <VeeField v-slot="{ errors, componentField }" name="email">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="email">{{
                  t('common.cards.email')
                }}</FieldLabel>
                <Input
                  id="email"
                  v-bind="componentField"
                  type="email"
                  :placeholder="t('forms.fields.email.examplePlaceholder')"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{
                  isSubmitting
                    ? t('loading.changingEmail')
                    : t('buttons.changeEmail')
                }}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <ResponsiveModal v-model:open="showChangeEmailModal">
      <template #title>
        <h2 class="text-2xl font-bold">{{ t('users.changeEmail') }}</h2>
      </template>
      <template #description>
        <p class="text-sm text-gray-500">
          {{ t('users.confirmationEmailSent', { email: values.email }) }}
        </p>
      </template>
      <template #close>
        <Button variant="outline">{{ t('buttons.close') }}</Button>
      </template>
    </ResponsiveModal>
  </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { useI18n } from 'vue-i18n';
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUpdateAuthUserEmail } from '@/features/auth/auth.query';
import { ChangeEmailBodySchema } from '@/features/auth/auth.schema';

const { t } = useI18n();

interface Props {
  email: string;
}

const props = defineProps<Props>();

const { handleSubmit, isSubmitting, setFieldValue, values } = useForm({
  initialValues: {
    email: props.email,
  },
  validationSchema: toTypedSchema(ChangeEmailBodySchema),
});

const updateAuthUserEmailMutation = useMutation(useUpdateAuthUserEmail());

const showChangeEmailModal = ref(false);

const onSubmit = handleSubmit(async values => {
  try {
    await updateAuthUserEmailMutation.mutateAsync({ email: values.email });
    toast.success(t('toasts.email.changeRequested'));
    showChangeEmailModal.value = true;
  } catch {
    toast.error(t('toasts.email.failedToChange'));
  }
});

watch(
  () => props.email,
  newValue => {
    setFieldValue('email', newValue);
  }
);
</script>

<style></style>
