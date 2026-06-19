<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';
import type { HTMLAttributes } from 'vue';

import { useMutation } from '@pinia/colada';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue-sonner';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useStorePostTag } from '@/features/shared/post-tags/post-tag.query';
import { useUploadPostFile } from '@/features/shared/posts/composables/useUploadPostFile';
import { useStorePost } from '@/features/shared/posts/post.query';
import { CreatePostSchema } from '@/features/shared/posts/post.schema';
import TagsInputAutocomplete from '@/features/shared/tags/components/TagsInputAutocomplete.vue';
import { useStoreTag } from '@/features/shared/tags/tag.query';
import { findTagByValue } from '@/features/shared/tags/tag.service';
import { cn } from '@/lib/utils';

const { t } = useI18n();

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

const localePath = useLocalePath();

const { handleSubmit, isSubmitting, resetForm, setFieldValue } = useForm({
  initialValues: {
    content: { blocks: [] } as OutputData,
    coverUrl: null as null | string,
    existingTags: [] as string[],
    newTags: [] as string[],
    title: '',
  },
  validationSchema: toTypedSchema(CreatePostSchema),
});

const { user } = useUserSession();
const uploadPostFile = useUploadPostFile();
const { mutateAsync: storePost } = useMutation(useStorePost());
const { mutateAsync: storeTag } = useMutation(useStoreTag());
const { mutateAsync: storePostTag } = useMutation(useStorePostTag());
const coverUploading = ref(false);
const submitStatus = ref<'draft' | 'published'>('draft');

const handleCoverChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !user.value?.id) return;
  coverUploading.value = true;
  try {
    const { publicUrl } = await uploadPostFile(user.value.id, file);
    setFieldValue('coverUrl', publicUrl);
  } catch {
    toast.error(t('toasts.post.failedToUploadCover'));
  } finally {
    coverUploading.value = false;
    input.value = '';
  }
};

const onSubmit = handleSubmit(async values => {
  if (!user.value?.id) {
    toast.error(t('toasts.mustBeLoggedIn'));
    return;
  }

  try {
    const post = await storePost({
      body: {
        content: values.content as unknown as Record<string, unknown>,
        coverUrl: values.coverUrl ?? null,
        status: submitStatus.value,
        title: values.title,
      },
    });

    const tagIds: string[] = [...values.existingTags];
    const uniqueNewTags = [...new Set(values.newTags)];

    for (const value of uniqueNewTags) {
      const existingTag = await findTagByValue(value);
      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        const tag = await storeTag({ body: { value } });
        tagIds.push(tag.id);
      }
    }

    for (const tagId of tagIds) {
      await storePostTag({ body: { postId: post.id, tagId } });
    }

    toast.success(
      submitStatus.value === 'published'
        ? t('toasts.post.published')
        : t('toasts.post.savedDraft')
    );
    resetForm();
    await navigateTo(
      localePath({
        name: 'profile',
      })
    );
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : t('toasts.post.failedToCreate')
    );
  }
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6 pb-2', props.class)">
    <h3 class="leading-none font-semibold">
      {{ t('posts.createPostTitle') }}
    </h3>
    <p class="text-muted-foreground text-sm">
      {{ t('posts.createPostDescription') }}
    </p>

    <form id="create-post" method="POST" @submit="onSubmit">
      <FieldGroup>
        <VeeField v-slot="{ errors, componentField }" name="title">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="title">{{ t('posts.title') }}</FieldLabel>
            <FieldDescription>
              {{ t('posts.titleDescription') }}
            </FieldDescription>
            <Input
              id="title"
              v-bind="componentField"
              type="text"
              :placeholder="t('posts.titlePlaceholder')"
              :aria-invalid="!!errors.length"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="content">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="content">{{ t('posts.content') }}</FieldLabel>
            <FieldDescription>
              {{ t('posts.contentDescription') }}
            </FieldDescription>
            <EditorJs
              :content="field.value ?? { blocks: [] }"
              class="min-h-24 w-full rounded-md border"
              @update:content="field.onChange"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <Field>
          <FieldLabel
            >{{ t('posts.coverImage') }} {{ t('posts.optional') }}</FieldLabel
          >
          <FieldDescription>
            {{ t('posts.coverImageDescription') }}
          </FieldDescription>
          <input
            type="file"
            accept="image/*"
            class="border-input file:border-primary file:bg-primary file:text-primary-foreground mt-1 block w-full rounded-md border bg-transparent text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
            :disabled="coverUploading"
            @change="handleCoverChange"
          />
          <p v-if="coverUploading" class="text-muted-foreground mt-1 text-sm">
            {{ t('loading.uploading') }}
          </p>
        </Field>

        <VeeField v-slot="{ errors, field, handleChange }" name="newTags">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="newTags"
              >{{ t('posts.tags') }} {{ t('posts.optional') }}</FieldLabel
            >
            <FieldDescription>
              {{ t('posts.tagsDescription') }}
            </FieldDescription>
            <TagsInputAutocomplete
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              @update:model-value="handleChange($event)"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <div class="flex flex-nowrap gap-2">
          <Button
            type="submit"
            :disabled="isSubmitting"
            @click="submitStatus = 'published'"
          >
            <Icon name="mdi:publish" size="1rem" />

            {{ isSubmitting ? t('loading.creating') : t('buttons.publish') }}
          </Button>
          <Button
            type="submit"
            variant="outline"
            :disabled="isSubmitting"
            @click="submitStatus = 'draft'"
          >
            <Icon name="mdi:content-save-outline" size="1rem" />

            {{ isSubmitting ? t('loading.saving') : t('buttons.saveDraft') }}
          </Button>
        </div>
      </FieldGroup>
    </form>
  </div>
</template>
