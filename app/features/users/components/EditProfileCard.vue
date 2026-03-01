<script lang="ts" setup>
import slugify from 'slugify';
import { toast } from 'vue-sonner';
import { z } from 'zod';

import type { User } from '~/features/shared/users/user.model';

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
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import { useIsUsernameExists } from '@/features/auth/composables/useIsUsernameExists';
import { useCreateTag } from '@/features/shared/tags/composables/useCreateTag';
import { useFindTagByValue } from '@/features/shared/tags/composables/useFindTagByValue';
import { useCreateUserTag } from '@/features/shared/user-tags/composables/useCreateUserTag';
import { useDeleteUserTag } from '@/features/shared/user-tags/composables/useDeleteUserTag';
import { useGetUserTagsWithDetails } from '@/features/shared/user-tags/composables/useGetUserTagsWithDetails';
import { useUpdateUser } from '@/features/shared/users/composables/useUpdateUser';
import { useUploadUserAvatar } from '@/features/shared/users/composables/useUploadUserAvatar';
import { getUserFullname } from '@/features/shared/users/composables/useUserFullname';

import { useUpdateAuthUserMetadata } from '../../shared/users/composables/useUpdateAuthUserMetadata';
import { formatFallbackUrl } from '../composables/useUserImageUrl';

interface Props {
  user: User;
}

const props = defineProps<Props>();

const SettingsSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  tags: z.array(z.string().min(1)),
  username: z.string().trim().min(1, 'Username is required'),
});

const { data: userTagsData } = useGetUserTagsWithDetails(() => props.user.id);

const tags = computed(() => userTagsData.value ?? []);

const avatarFile = ref<File | null>(null);
const avatarPreviewUrl = ref<null | string>(null);
const avatarInputRef = ref<HTMLInputElement | null>(null);

const avatarUrl = computed(
  () =>
    props.user.image_url ??
    formatFallbackUrl(props.user.first_name, props.user.last_name)
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
    firstName: '',
    lastName: '',
    tags: [] as string[],
    username: '',
  },
  validationSchema: toTypedSchema(SettingsSchema),
});

const stopInitWatch = watchEffect(() => {
  if (props.user && userTagsData.value !== undefined) {
    resetForm({
      values: {
        firstName: props.user.first_name ?? '',
        lastName: props.user.last_name ?? '',
        tags: userTagsData.value.map(t => t.tag.value),
        username: props.user.username ?? '',
      },
    });
    stopInitWatch();
  }
});

const usernameToCheck = ref('');
const usernameExistsQuery = useIsUsernameExists({
  get username() {
    return usernameToCheck.value;
  },
});

const updateUserMutation = useUpdateUser();
const uploadUserAvatar = useUploadUserAvatar();
const createTagMutation = useCreateTag();
const createUserTagMutation = useCreateUserTag();
const deleteUserTagMutation = useDeleteUserTag();
const findTagByValue = useFindTagByValue();

const updateAuthUserMetadataMutation = useUpdateAuthUserMetadata();

const onSubmit = handleSubmit(async values => {
  if (!props.user) return;

  try {
    if (values.username !== props.user.username) {
      usernameToCheck.value = values.username;
      const { data: isExists, error: usernameError } =
        await usernameExistsQuery.refetch();
      if (usernameError) {
        toast.error('Unable to validate username uniqueness right now.');
        return;
      }
      if (isExists) {
        setFieldError('username', 'Username already taken');
        return;
      }
    }

    let imageUrl = props.user.image_url;
    if (avatarFile.value) {
      imageUrl = await uploadUserAvatar(props.user.id, avatarFile.value);
    }

    await updateUserMutation.mutateAsync({
      id: props.user.id,
      updates: {
        first_name: values.firstName,
        image_url: imageUrl,
        last_name: values.lastName,
        username: values.username,
      },
    });

    await updateAuthUserMetadataMutation.mutateAsync({
      first_name: values.firstName,
      image_url: imageUrl,
      last_name: values.lastName,
    });

    const originalTagMap = new Map(
      tags.value.map(t => [t.tag.value, t.tag_id])
    );
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
          const tag = await createTagMutation.mutateAsync({
            slug: slugify(value, { lower: true, strict: true }),
            value,
          });
          resolvedTagIds.push(tag.id);
        }
      }
    }

    const originalIds = new Set(originalTagMap.values());
    for (const tagId of resolvedTagIds) {
      if (!originalIds.has(tagId)) {
        await createUserTagMutation.mutateAsync({
          tag_id: tagId,
          user_id: props.user.id,
        });
      }
    }

    const resolvedSet = new Set(resolvedTagIds);
    for (const [, tagId] of originalTagMap) {
      if (!resolvedSet.has(tagId)) {
        await deleteUserTagMutation.mutateAsync({
          tagId,
          userId: props.user.id,
        });
      }
    }

    avatarFile.value = null;
    avatarPreviewUrl.value = null;

    toast.success('Profile updated successfully');
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Failed to update profile'
    );
  }
});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Profile</CardTitle>
      <CardDescription>
        Update your personal information and profile picture.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="settings" method="POST" @submit="onSubmit">
        <FieldGroup>
          <Field class="items-center">
            <FieldLabel>Profile picture</FieldLabel>
            <button
              type="button"
              class="group relative cursor-pointer self-start rounded-full"
              @click="handleAvatarClick"
            >
              <Avatar class="size-20">
                <AvatarImage
                  :src="currentAvatarUrl"
                  :alt="getUserFullname(props.user)"
                />
                <AvatarFallback>{{
                  props.user.first_name?.charAt(0) ??
                  props.user.last_name?.charAt(0) ??
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

          <VeeField v-slot="{ field, errors }" name="tags">
            <Field :data-invalid="!!errors.length">
              <FieldLabel>Interests & skills</FieldLabel>
              <TagsInput
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                class="min-h-10"
                @update:model-value="field.onChange"
              >
                <TagsInputItem
                  v-for="tag in field.value"
                  :key="tag"
                  :value="tag"
                >
                  <TagsInputItemText />
                  <TagsInputItemDelete />
                </TagsInputItem>
                <TagsInputInput placeholder="Add a tag and press Enter" />
              </TagsInput>
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>

          <Field>
            <Button type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : 'Save changes' }}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>
