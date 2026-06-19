<script lang="ts" setup>
import type { User } from '#shared/features/users';

import { useMutation, useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { usernameExistsQuery } from '@/features/auth/auth.query';
import TagsInputAutocomplete from '@/features/shared/tags/components/TagsInputAutocomplete.vue';
import { useStoreTag } from '@/features/shared/tags/tag.query';
import { findTagByValue } from '@/features/shared/tags/tag.service';
import {
  useDestroyUserTag,
  userTagListQuery,
  useStoreUserTag,
} from '@/features/shared/user-tags/user-tag.query';
import { useUploadUserAvatar } from '@/features/shared/users/composables/useUploadUserAvatar';
import { getUserFullname } from '@/features/shared/users/composables/useUserFullname';
import { useUpdateProfile } from '@/features/shared/users/user.query';
import { formatFallbackUrl } from '@/features/users/composables/useUserImageUrl';

const { t } = useI18n();

interface Props {
  user: Serialize<User>;
}

const props = defineProps<Props>();

const SettingsSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  tags: z.array(z.string().min(1)),
  username: z.string().trim().min(1),
});

const fetchFn = useRequestFetch();

const { data: userTagsData } = useQuery(() => ({
  ...userTagListQuery({ fetchFn, userId: props.user.id }),
  enabled: Boolean(props.user.id),
}));

const tags = computed(() => userTagsData.value?.data ?? []);

const avatarFile = ref<File | null>(null);
const avatarPreviewUrl = ref<null | string>(null);
const avatarInputRef = ref<HTMLInputElement | null>(null);

const avatarUrl = computed(
  () =>
    props.user.imageUrl ??
    formatFallbackUrl(props.user.firstName, props.user.lastName)
);

const currentAvatarUrl = computed(
  () => avatarPreviewUrl.value ?? avatarUrl.value
);

const handleAvatarClick = () => {
  avatarInputRef.value?.click();
};

const handleAvatarChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  avatarFile.value = file;
  if (avatarPreviewUrl.value) URL.revokeObjectURL(avatarPreviewUrl.value);
  avatarPreviewUrl.value = URL.createObjectURL(file);
  input.value = '';
};

const { handleSubmit, isSubmitting, resetForm, setFieldError } = useForm({
  initialValues: {
    firstName: props.user.firstName ?? '',
    lastName: props.user.lastName ?? '',
    tags: [] as string[],
    username: props.user.username ?? '',
  },
  validationSchema: toTypedSchema(SettingsSchema),
});

// Custom field validator with translations
const validateField = (
  field: 'firstName' | 'lastName' | 'username',
  value: string
): string | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    const keyMap = {
      firstName: 'users.firstNameRequired',
      lastName: 'users.lastNameRequired',
      username: 'users.usernameRequired',
    };
    return t(keyMap[field]);
  }
  return undefined;
};

watch(
  [() => props.user, userTagsData],
  ([user, tagsData]) => {
    if (user && tagsData !== undefined) {
      resetForm({
        values: {
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          tags: tags.value.map(t => t.tag.value),
          username: user.username ?? '',
        },
      });
    }
  },
  { immediate: true }
);

const usernameToCheck = ref('');
const { refetch: refetchUsernameExists } = useQuery(() =>
  usernameExistsQuery({ fetchFn, username: usernameToCheck.value })
);

const { mutateAsync: updateProfile } = useMutation(useUpdateProfile());
const uploadUserAvatar = useUploadUserAvatar();
const { mutateAsync: storeTag } = useMutation(useStoreTag());
const { mutateAsync: storeUserTag } = useMutation(useStoreUserTag());
const { mutateAsync: destroyUserTag } = useMutation(useDestroyUserTag());

const onSubmit = handleSubmit(async values => {
  if (!props.user) return;

  // Validate required fields with translations
  const firstNameError = validateField('firstName', values.firstName);
  const lastNameError = validateField('lastName', values.lastName);
  const usernameError = validateField('username', values.username);

  if (firstNameError) {
    setFieldError('firstName', firstNameError);
    return;
  }
  if (lastNameError) {
    setFieldError('lastName', lastNameError);
    return;
  }
  if (usernameError) {
    setFieldError('username', usernameError);
    return;
  }

  try {
    if (values.username !== props.user.username) {
      usernameToCheck.value = values.username;
      const { data: isExists, error: usernameError } =
        await refetchUsernameExists();
      if (usernameError) {
        toast.error(t('toasts.mustBeLoggedIn'));
        return;
      }
      if (isExists) {
        setFieldError('username', t('users.usernameAlreadyTaken'));
        return;
      }
    }

    let imageUrl = props.user.imageUrl;
    if (avatarFile.value) {
      imageUrl = await uploadUserAvatar(props.user.id, avatarFile.value);
    }

    await updateProfile({
      body: {
        firstName: values.firstName,
        imageUrl: imageUrl ?? undefined,
        lastName: values.lastName,
        username: values.username,
      },
      id: props.user.id,
    });

    const originalTagMap = new Map(tags.value.map(t => [t.tag.value, t.tagId]));
    const uniqueTagValues = [...new Set(values.tags)];

    const resolvedTagIds: string[] = [];
    for (const value of uniqueTagValues) {
      if (originalTagMap.has(value)) {
        resolvedTagIds.push(originalTagMap.get(value)!);
      } else {
        const existing = await findTagByValue(value);
        if (existing) {
          resolvedTagIds.push(existing.id);
        } else {
          const tag = await storeTag({ body: { value } });
          resolvedTagIds.push(tag.id);
        }
      }
    }

    const originalIds = new Set(originalTagMap.values());
    for (const tagId of resolvedTagIds) {
      if (!originalIds.has(tagId)) {
        await storeUserTag({ body: { tagId, userId: props.user.id } });
      }
    }

    const resolvedSet = new Set(resolvedTagIds);
    for (const [, tagId] of originalTagMap) {
      if (!resolvedSet.has(tagId)) {
        await destroyUserTag({ tagId, userId: props.user.id });
      }
    }

    avatarFile.value = null;
    avatarPreviewUrl.value = null;

    toast.success(t('toasts.profile.updated'));
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : t('toasts.profile.failedToUpdate')
    );
  }
});
</script>

<template>
  <ClientOnly>
    <Card>
      <CardHeader>
        <CardTitle>{{ t('buttons.profile') }}</CardTitle>
        <CardDescription>
          {{ t('users.profileUpdateDescription') }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="settings" method="POST" @submit="onSubmit">
          <FieldGroup>
            <Field class="items-center">
              <FieldLabel>{{ t('users.profilePicture') }}</FieldLabel>
              <button
                type="button"
                class="group relative cursor-pointer self-start rounded-full"
                @click="handleAvatarClick"
              >
                <Avatar class="size-20">
                  <AvatarImage
                    :src="currentAvatarUrl"
                    :alt="
                      getUserFullname(props.user, t('users.defaultUsername'))
                    "
                  />
                  <AvatarFallback>{{
                    props.user.firstName?.charAt(0) ??
                    props.user.lastName?.charAt(0) ??
                    props.user.username?.charAt(0) ??
                    'U'
                  }}</AvatarFallback>
                </Avatar>
                <div
                  class="bg-background/70 absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Icon name="mdi:camera" class="text-foreground size-6" />
                </div>
              </button>
              <input
                ref="avatarInputRef"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                class="hidden"
                @change="handleAvatarChange"
              />
            </Field>

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

            <VeeField v-slot="{ errors, field, handleChange }" name="tags">
              <Field :data-invalid="!!errors.length">
                <FieldLabel>{{ t('users.interestsSkills') }}</FieldLabel>
                <TagsInputAutocomplete
                  :model-value="field.value"
                  :aria-invalid="!!errors.length"
                  @update:model-value="handleChange($event)"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{
                  isSubmitting ? t('loading.saving') : t('buttons.saveChanges')
                }}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </ClientOnly>
</template>
