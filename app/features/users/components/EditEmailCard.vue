<template>
  <div class="h-full w-full">
    <Card>
      <CardHeader>
        <CardTitle>Change Email</CardTitle>
        <CardDescription> Update your email address. </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="email" method="POST" @submit="onSubmit">
          <FieldGroup>
            <VeeField v-slot="{ field, errors }" name="email">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="email">Email</FieldLabel>
                <Input
                  id="email"
                  :model-value="field.value"
                  type="email"
                  placeholder="email@example.com"
                  :aria-invalid="!!errors.length"
                  @update:model-value="field.onChange"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Changing email...' : 'Change email' }}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <ResponsiveModal v-model:open="showChangeEmailModal">
      <template #title>
        <h2 class="text-2xl font-bold">Change your email</h2>
      </template>
      <template #description>
        <p class="text-sm text-gray-500">
          We've sent a confirmation email to {{ values.email }}. Please check
          your inbox and click the link to change your email address.
        </p>
      </template>
      <template #close>
        <Button variant="outline">Close</Button>
      </template>
    </ResponsiveModal>
  </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/zod';
import { withQuery } from 'ufo';
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
import { ChangeEmailBodySchema } from '@/features/auth/auth.schema';
import { useUpdateAuthUserEmail } from '@/features/auth/composables/useUpdateAuthUserEmail';

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

const updateAuthUserEmailMutation = useUpdateAuthUserEmail();

const showChangeEmailModal = ref(false);

const config = useRuntimeConfig();

const onSubmit = handleSubmit(async values => {
  try {
    await updateAuthUserEmailMutation.mutateAsync({
      email: values.email,
      emailRedirectTo: withQuery(`${config.public.appUrl}/confirm`, {
        type: 'email_change',
      }),
    });
    toast.success('Email change requested');
    showChangeEmailModal.value = true;
  } catch {
    toast.error('Failed to update email');
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
