<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';
import type { HTMLAttributes } from 'vue';

import { nanoid } from 'nanoid';
import slugify from 'slugify';
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
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@/components/ui/tags-input';
import { useCreatePostTag } from '@/features/shared/post-tags/composables/useCreatePostTag';
import { useCreatePost } from '@/features/shared/posts/composables/useCreatePost';
import { useUploadPostFile } from '@/features/shared/posts/composables/useUploadPostFile';
import { CreatePostSchema } from '@/features/shared/posts/post.schema';
import { useCreateTag } from '@/features/shared/tags/composables/useCreateTag';
import { useFindTagByValue } from '@/features/shared/tags/composables/useFindTagByValue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
}>();

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

const user = useSupabaseUser();
const uploadPostFile = useUploadPostFile();
const createPostMutation = useCreatePost();
const createTagMutation = useCreateTag();
const createPostTagMutation = useCreatePostTag();
const findTagByValue = useFindTagByValue();
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
    toast.error('Failed to upload cover image');
  } finally {
    coverUploading.value = false;
    input.value = '';
  }
};

const onSubmit = handleSubmit(async values => {
  const authorId = user.value?.sub;
  console.log(authorId);
  if (!authorId) {
    toast.error('You must be logged in to create a post');
    return;
  }

  const slug = `${slugify(values.title, { lower: true, strict: true })}-${nanoid(6)}`;

  try {
    const post = await createPostMutation.mutateAsync({
      author_id: authorId,
      content: values.content as unknown as Tables<'posts'>['content'],
      cover_url: values.coverUrl ?? null,
      slug,
      status: submitStatus.value,
      title: values.title,
    });

    const tagIds: string[] = [...values.existingTags];
    const uniqueNewTags = [...new Set(values.newTags)];

    for (const value of uniqueNewTags) {
      const existingTag = await findTagByValue(value);
      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        const tag = await createTagMutation.mutateAsync({
          slug: slugify(value, { lower: true, strict: true }),
          value,
        });
        tagIds.push(tag.id);
      }
    }

    for (const tagId of tagIds) {
      await createPostTagMutation.mutateAsync({
        post_id: post.id,
        tag_id: tagId,
      });
    }

    toast.success(
      submitStatus.value === 'published'
        ? 'Post published'
        : 'Post saved as draft'
    );
    resetForm();
    await navigateTo({
      name: 'profile',
    });
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Failed to create post'
    );
  }
});
</script>

<template>
  <div :class="cn('flex flex-col gap-6 pb-2', props.class)">
    <h3 class="leading-none font-semibold">Create a post</h3>
    <p class="text-muted-foreground text-sm">
      Get ready to share your thoughts! Creating an article is easy. Just fill
      out the form below, and let your ideas shine. Start now and be part of our
      community!
    </p>

    <form id="create-post" method="POST" @submit="onSubmit">
      <FieldGroup>
        <VeeField v-slot="{ field, errors }" name="title">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="title">Title</FieldLabel>
            <FieldDescription>
              Craft a captivating headline that summarizes the essence of your
              article and sparks curiosity.
            </FieldDescription>
            <Input
              id="title"
              v-bind="field"
              type="text"
              placeholder="Your post title"
              :aria-invalid="!!errors.length"
            />
            <FieldError v-if="errors.length" :errors="errors" />
          </Field>
        </VeeField>

        <VeeField v-slot="{ field, errors }" name="content">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="content">Content</FieldLabel>
            <FieldDescription>
              Pour your ideas, insights, and expertise into engaging and
              informative prose to captivate your audience.
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
          <FieldLabel>Cover image (optional)</FieldLabel>
          <FieldDescription>
            Choose an eye-catching image to grab your audience's attention.
          </FieldDescription>
          <input
            type="file"
            accept="image/*"
            class="border-input file:border-primary file:bg-primary file:text-primary-foreground mt-1 block w-full rounded-md border bg-transparent text-sm file:mr-4 file:rounded-md file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
            :disabled="coverUploading"
            @change="handleCoverChange"
          />
          <p v-if="coverUploading" class="text-muted-foreground mt-1 text-sm">
            Uploading...
          </p>
        </Field>

        <VeeField v-slot="{ field, errors }" name="newTags">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="newTags">Tags (optional)</FieldLabel>
            <FieldDescription>
              Add descriptive keywords to categorize your article and improve
              discoverability.
            </FieldDescription>
            <TagsInput
              :model-value="field.value"
              :aria-invalid="!!errors.length"
              class="min-h-10"
              @update:model-value="field.onChange"
            >
              <TagsInputItem v-for="tag in field.value" :key="tag" :value="tag">
                <TagsInputItemText />
                <TagsInputItemDelete />
              </TagsInputItem>
              <TagsInputInput placeholder="Add a tag and press Enter" />
            </TagsInput>
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

            {{ isSubmitting ? 'Creating...' : 'Publish' }}
          </Button>
          <Button
            type="submit"
            variant="outline"
            :disabled="isSubmitting"
            @click="submitStatus = 'draft'"
          >
            <Icon name="mdi:content-save-outline" size="1rem" />

            {{ isSubmitting ? 'Saving...' : 'Save as draft' }}
          </Button>
        </div>
      </FieldGroup>
    </form>
  </div>
</template>
