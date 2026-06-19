import type { ReactionType } from '#shared/features/reactions';

import { ref, shallowRef } from 'vue';

const commentId = ref<null | string>(null);
const open = ref(false);
const postId = ref<null | string>(null);
const reactionsDetails = shallowRef<Partial<Record<ReactionType, number>>>({});
const selectedTab = ref<'all' | ReactionType>('all');

export function useReactionsDrawer() {
  function openForPost(
    id: string,
    details: Partial<Record<ReactionType, number>>
  ) {
    postId.value = id;
    commentId.value = null;
    reactionsDetails.value = details;
    selectedTab.value = 'all';
    open.value = true;
  }

  function openForComment(
    id: string,
    details: Partial<Record<ReactionType, number>>
  ) {
    commentId.value = id;
    postId.value = null;
    reactionsDetails.value = details;
    selectedTab.value = 'all';
    open.value = true;
  }

  const state = {
    get commentId() {
      return commentId.value;
    },
    set commentId(v: null | string) {
      commentId.value = v;
    },
    get open() {
      return open.value;
    },
    set open(v: boolean) {
      open.value = v;
    },
    get postId() {
      return postId.value;
    },
    set postId(v: null | string) {
      postId.value = v;
    },
    get reactionsDetails() {
      return reactionsDetails.value;
    },
    set reactionsDetails(v: Partial<Record<ReactionType, number>>) {
      reactionsDetails.value = v;
    },
    get selectedTab() {
      return selectedTab.value;
    },
    set selectedTab(v: 'all' | ReactionType) {
      selectedTab.value = v;
    },
  };

  return { openForComment, openForPost, state };
}
