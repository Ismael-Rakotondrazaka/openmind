<script setup lang="ts">
import type { OutputData } from '@editorjs/editorjs';
import type { HTMLAttributes } from 'vue';

import slugify from 'slugify';
import { toast } from 'vue-sonner';

import type { Post } from '@/features/shared/posts/post.model';

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
import { useDeletePostTag } from '@/features/shared/post-tags/composables/useDeletePostTag';
import { useUpdatePost } from '@/features/shared/posts/composables/useUpdatePost';
import { useUploadPostFile } from '@/features/shared/posts/composables/useUploadPostFile';
import { UpdatePostSchema } from '@/features/shared/posts/post.schema';
import { useCreateTag } from '@/features/shared/tags/composables/useCreateTag';
import { useFindTagByValue } from '@/features/shared/tags/composables/useFindTagByValue';
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: HTMLAttributes['class'];
  post: Post;
}>();

const originalTagMap = computed(
  () => new Map(props.post.tags.map(t => [t.tag.value, t.tag.id]))
);

const { handleSubmit, isSubmitting, setFieldValue } = useForm({
  initialValues: {
    content: props.post.content as OutputData,
    coverUrl: props.post.cover_url ?? null,
    tags: props.post.tags.map(t => t.tag.value),
    title: props.post.title,
  },
  validationSchema: toTypedSchema(UpdatePostSchema),
});

const user = useSupabaseUser();
const uploadPostFile = useUploadPostFile();
const updatePostMutation = useUpdatePost();
const createTagMutation = useCreateTag();
const createPostTagMutation = useCreatePostTag();
const deletePostTagMutation = useDeletePostTag();
const findTagByValue = useFindTagByValue();
const coverUploading = ref(false);
const submitStatus = ref<'draft' | 'published'>(
  props.post.status as 'draft' | 'published'
);

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

const router = useRouter();

const goBack = () => {
  if (window?.history?.length > 1) {
    router.back();
  } else {
    navigateTo('/');
  }
};

const onSubmit = handleSubmit(async values => {
  try {
    await updatePostMutation.mutateAsync({
      id: props.post.id,
      updates: {
        content: values.content as unknown as Tables<'posts'>['content'],
        cover_url: values.coverUrl ?? null,
        slug: slugify(values.title, { lower: true, strict: true }),
        status: submitStatus.value,
        title: values.title,
      },
    });

    const currentTagValues = values.tags;

    // Resolve all current tag values to IDs
    const resolvedTagIds: string[] = [];
    const uniqueValues = [...new Set(currentTagValues)];

    for (const value of uniqueValues) {
      if (originalTagMap.value.has(value)) {
        resolvedTagIds.push(originalTagMap.value.get(value)!);
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

    // Add new post-tag associations
    const originalIds = new Set(originalTagMap.value.values());
    for (const tagId of resolvedTagIds) {
      if (!originalIds.has(tagId)) {
        await createPostTagMutation.mutateAsync({
          post_id: props.post.id,
          tag_id: tagId,
        });
      }
    }

    // Remove deleted post-tag associations
    const resolvedSet = new Set(resolvedTagIds);
    for (const [, tagId] of originalTagMap.value) {
      if (!resolvedSet.has(tagId)) {
        await deletePostTagMutation.mutateAsync({
          postId: props.post.id,
          tagId,
        });
      }
    }

    toast.success(
      submitStatus.value === 'published'
        ? 'Post published'
        : 'Post saved as draft'
    );

    goBack();
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : 'Failed to update post'
    );
  }
});
</script>

<template>
  <div :class="cn('space-y-6', props.class)">
    <h3 class="leading-none font-semibold">Edit post</h3>

    <p class="text-muted-foreground text-sm">
      Update your post details below. Changes will be reflected immediately
      after saving.
    </p>

    <form id="edit-post" method="POST" @submit="onSubmit">
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
              :model-value="field.value as string"
              type="text"
              placeholder="Your post title"
              :aria-invalid="!!errors.length"
              @update:model-value="field.onChange"
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

        <VeeField v-slot="{ field, errors }" name="tags">
          <Field :data-invalid="!!errors.length">
            <FieldLabel for="tags">Tags (optional)</FieldLabel>
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

            {{ isSubmitting ? 'Saving...' : 'Publish' }}
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
