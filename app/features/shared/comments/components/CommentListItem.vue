<!-- eslint-disable vue/no-v-html -->
<script lang="ts" setup>
import type { OutputData } from '@editorjs/editorjs';
import type { Comment } from '#shared/features/comments';

import { useMutation } from '@pinia/colada';
import { useTimeAgo } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

import LoginPromptModal from '@/components/common/LoginPromptModal.vue';
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

import { useReactionsDrawer } from '../../reactions/composables/useReactionsDrawer';
import { useDestroyComment, useUpdateComment } from '../comment.query';
import CommentReactionActions from './CommentReactionActions.vue';
import CommentReactionsSummary from './CommentReactionsSummary.vue';

type Props = {
  comment: Serialize<Comment>;
  showReplyButton?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{ reply: [] }>();

const { t } = useI18n();
const { user } = useUserSession();
const userFullname = useUserFullname(
  () => props.comment.author,
  t('users.defaultUsername')
);
const userImageUrl = useUserImageUrl(() => props.comment.author);
const timeAgo = useTimeAgo(() => new Date(props.comment.createdAt));
const renderedContent = useRenderEditorHTML(
  () => props.comment.content as OutputData
);

const { openForComment } = useReactionsDrawer();

const isAuthor = computed(() => user.value?.id === props.comment.authorId);

const isEditing = ref(false);
const editContent = ref<OutputData>(props.comment.content as OutputData);
const editorKey = ref(0);

const deleteDialogOpen = ref(false);
const loginPromptOpen = ref(false);

const handleReplyClick = () => {
  if (!user.value?.id) {
    loginPromptOpen.value = true;
    return;
  }
  emit('reply');
};

const { isLoading: isUpdating, mutateAsync: updateComment } =
  useMutation(useUpdateComment());
const { isLoading: isDeleting, mutateAsync: deleteComment } =
  useMutation(useDestroyComment());

const isEmpty = computed(
  () =>
    !editContent.value.blocks.length ||
    editContent.value.blocks.every(
      b => !b.data || (typeof b.data.text === 'string' && !b.data.text.trim())
    )
);

const handleStartEdit = () => {
  editContent.value = props.comment.content as OutputData;
  editorKey.value++;
  isEditing.value = true;
};

const handleCancelEdit = () => {
  isEditing.value = false;
};

const handleSaveEdit = async () => {
  if (isEmpty.value) return;
  await updateComment({
    body: {
      content: editContent.value,
    },
    id: props.comment.id,
  });
  isEditing.value = false;
};

const handleDelete = async () => {
  await deleteComment({ id: props.comment.id });
  deleteDialogOpen.value = false;
};

const isExpanded = ref(false);
</script>

<template>
  <div
    class="group/comment hover:bg-muted flex gap-3 rounded-lg p-3 transition-all duration-200"
  >
    <NuxtLinkLocale
      :to="{
        name: 'u-userKey',
        params: { userKey: comment.author.username || comment.author.id },
      }"
      class="shrink-0"
    >
      <Avatar class="size-8">
        <AvatarImage :src="userImageUrl" />
      </Avatar>
    </NuxtLinkLocale>

    <div class="flex flex-1 flex-col gap-1">
      <div class="flex items-center justify-between">
        <div class="flex items-baseline gap-2">
          <NuxtLinkLocale
            :to="{
              name: 'u-userKey',
              params: { userKey: comment.author.username || comment.author.id },
            }"
            class="text-sm font-semibold hover:underline"
          >
            {{ userFullname }}
          </NuxtLinkLocale>
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
                {{ t('comments.edit') }}
                <DropdownMenuShortcut>
                  <Icon name="mdi:pencil" size="1rem" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                @click="deleteDialogOpen = true"
              >
                {{ t('comments.delete') }}
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
            {{ t('comments.cancel') }}
          </Button>
          <Button
            type="button"
            size="sm"
            :disabled="isUpdating || isEmpty"
            @click="handleSaveEdit"
          >
            <Icon v-if="isUpdating" name="mdi:loading" class="animate-spin" />
            {{ t('comments.save') }}
          </Button>
        </div>
      </template>

      <template v-else>
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="prose prose-sm max-w-none"
          :class="{ 'line-clamp-5': !isExpanded }"
          v-html="renderedContent"
        />
        <!-- eslint-enable vue/no-v-html -->
        <button
          class="text-muted-foreground hover:text-foreground text-xs text-left font-medium transition-colors"
          type="button"
          @click="isExpanded = !isExpanded"
        >
          {{ isExpanded ? t('comments.showLess') : t('comments.showMore') }}
        </button>

        <CommentReactionsSummary
          :comment="comment"
          @reactions-drawer:open="
            openForComment(comment.id, comment.reactionsDetails)
          "
        />

        <div class="flex items-center gap-2">
          <CommentReactionActions :comment="comment" />
          <button
            v-if="showReplyButton"
            class="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
            type="button"
            @click="handleReplyClick"
          >
            {{ t('comments.reply') }}
          </button>
        </div>
      </template>
    </div>
  </div>

  <LoginPromptModal
    v-model:open="loginPromptOpen"
    :action="t('reactions.replyToComments')"
  />

  <ResponsiveModal v-model:open="deleteDialogOpen">
    <template #title>{{ t('comments.deleteComment') }}</template>
    <template #description>
      {{ t('comments.deleteCommentDescription') }}
    </template>
    <div class="flex justify-end gap-2 pt-4">
      <Button
        type="button"
        variant="outline"
        :disabled="isDeleting"
        @click="deleteDialogOpen = false"
      >
        {{ t('comments.cancel') }}
      </Button>
      <Button
        type="button"
        variant="destructive"
        :disabled="isDeleting"
        @click="handleDelete"
      >
        <Icon v-if="isDeleting" name="mdi:loading" class="animate-spin" />
        {{ t('comments.delete') }}
      </Button>
    </div>
  </ResponsiveModal>
</template>
