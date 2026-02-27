<!-- eslint-disable vue/no-v-html -->
<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';

import { useTimeAgo } from '@vueuse/core';

import ResponsiveModal from '@/components/common/ResponsiveModal.vue';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserFullname } from '~/features/shared/users/composables/useUserFullname';
import { useUserImageUrl } from '~/features/users/composables/useUserImageUrl';

import type { ReactionTypes } from '../../reactions/reaction.model';
import type { Comment } from '../comment.model';

import ReactionsDrawer from '../../reactions/components/ReactionsDrawer.vue';
import { useDeleteComment } from '../composables/useDeleteComment';
import { useUpdateComment } from '../composables/useUpdateComment';
import CommentReactionActions from './CommentReactionActions.vue';
import CommentReactionsSummary from './CommentReactionsSummary.vue';

type Props = {
  comment: Comment;
  showReplyButton?: boolean;
};

type ReactionTab = 'all' | (typeof ReactionTypes)[number];

const props = defineProps<Props>();

const emit = defineEmits<{ reply: [] }>();

const user = useSupabaseUser();
const userFullname = useUserFullname(() => props.comment.author);
const userImageUrl = useUserImageUrl(() => props.comment.author);
const timeAgo = useTimeAgo(() => new Date(props.comment.created_at));
const renderedContent = useRenderEditorHTML(() => props.comment.content);

const reactionsDrawerOpen = ref(false);
const reactionsTab = ref<ReactionTab>('all');

const isAuthor = computed(() => user.value?.sub === props.comment.author_id);

const isEditing = ref(false);
const editContent = ref<OutputData>(
  props.comment.content as unknown as OutputData
);
const editorKey = ref(0);

const deleteDialogOpen = ref(false);

const { isPending: isUpdating, mutateAsync: updateComment } =
  useUpdateComment();
const { isPending: isDeleting, mutateAsync: deleteComment } =
  useDeleteComment();

const isEmpty = computed(
  () =>
    !editContent.value.blocks.length ||
    editContent.value.blocks.every(
      b => !b.data || (typeof b.data.text === 'string' && !b.data.text.trim())
    )
);

const handleStartEdit = () => {
  editContent.value = props.comment.content as unknown as OutputData;
  editorKey.value++;
  isEditing.value = true;
};

const handleCancelEdit = () => {
  isEditing.value = false;
};

const handleSaveEdit = async () => {
  if (isEmpty.value) return;
  await updateComment({
    id: props.comment.id,
    updates: {
      content: editContent.value as unknown as Tables<'comments'>['content'],
    },
  });
  isEditing.value = false;
};

const handleDelete = async () => {
  await deleteComment(props.comment.id);
  deleteDialogOpen.value = false;
};
</script>

<template>
  <div
    class="group/comment hover:bg-muted flex gap-3 rounded-lg p-3 transition-all duration-200"
  >
    <NuxtLink
      :to="{
        name: 'u-userKey',
        params: { userKey: comment.author.username || comment.author.id },
      }"
      class="shrink-0"
    >
      <Avatar class="size-8">
        <AvatarImage :src="userImageUrl" />
      </Avatar>
    </NuxtLink>

    <div class="flex flex-1 flex-col gap-1">
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <NuxtLink
            :to="{
              name: 'u-userKey',
              params: { userKey: comment.author.username || comment.author.id },
            }"
            class="text-sm font-semibold hover:underline"
          >
            {{ userFullname }}
          </NuxtLink>
          <span class="text-muted-foreground text-xs">{{ timeAgo }}</span>
        </div>

        <DropdownMenu v-if="isAuthor">
          <DropdownMenuTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="opacity-0 transition-opacity group-hover/comment:opacity-100"
            >
              <Icon name="mdi:dots-vertical" size="1rem" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem @click="handleStartEdit">
                Edit
                <DropdownMenuShortcut>
                  <Icon name="mdi:pencil" size="1rem" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                @click="deleteDialogOpen = true"
              >
                Delete
                <DropdownMenuShortcut>
                  <Icon name="mdi:trash-can" size="1rem" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <template v-if="isEditing">
        <EditorJs
          :key="editorKey"
          v-model:content="editContent"
          class="min-h-16 w-full rounded-md border"
        />
        <div class="flex justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            :disabled="isUpdating"
            @click="handleCancelEdit"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            :disabled="isUpdating || isEmpty"
            @click="handleSaveEdit"
          >
            <Icon v-if="isUpdating" name="mdi:loading" class="animate-spin" />
            Save
          </Button>
        </div>
      </template>

      <template v-else>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose prose-sm max-w-none" v-html="renderedContent" />

        <CommentReactionsSummary
          :comment="comment"
          @reactions-drawer:open="reactionsDrawerOpen = true"
        />

        <div class="flex items-center gap-2">
          <CommentReactionActions :comment="comment" />
          <button
            v-if="showReplyButton"
            class="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
            type="button"
            @click="emit('reply')"
          >
            Reply
          </button>
        </div>
      </template>
    </div>
  </div>

  <ReactionsDrawer
    v-model:open="reactionsDrawerOpen"
    v-model:selected-reaction-tab="reactionsTab"
    :comment-id="comment.id"
    :reactions-details="comment.reactions_details"
  />

  <ResponsiveModal v-model:open="deleteDialogOpen">
    <template #title>Delete comment</template>
    <template #description>
      This action cannot be undone. The comment will be permanently deleted.
    </template>
    <div class="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        :disabled="isDeleting"
        @click="deleteDialogOpen = false"
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="destructive"
        :disabled="isDeleting"
        @click="handleDelete"
      >
        <Icon v-if="isDeleting" name="mdi:loading" class="animate-spin" />
        Delete
      </Button>
    </div>
  </ResponsiveModal>
</template>
