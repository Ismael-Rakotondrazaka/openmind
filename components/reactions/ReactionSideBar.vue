<template>
  <PrimeSidebar
    v-model:visible="isVisible"
    position="right"
    class="w-full md:w-[20rem] lg:w-[30rem] overflow-y-auto"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <span class="font-bold">Reactions</span>
      </div>
    </template>

    <PrimeTabView class="items-stretch">
      <PrimeTabPanel>
        <template #header>
          <span>All {{ allCounts }}</span>
        </template>
        <ReactionTabContent
          :article-id="articleId"
          :comment-id="commentId"
          reaction-type="*"
          @total-counts:update="onAllCountsUpdate"
        />
      </PrimeTabPanel>

      <PrimeTabPanel>
        <template #header>
          <ReactionIcon type="like" class="mr-1 block" size="small" />

          {{ likeCounts }}
        </template>

        <ReactionTabContent
          :article-id="articleId"
          :comment-id="commentId"
          reaction-type="like"
          @total-counts:update="onLikeCountsUpdate"
        />
      </PrimeTabPanel>

      <PrimeTabPanel>
        <template #header>
          <ReactionIcon type="love" class="mr-1" size="small" />

          {{ loveCounts }}
        </template>

        <ReactionTabContent
          :article-id="articleId"
          :comment-id="commentId"
          reaction-type="love"
          @total-counts:update="onLoveCountsUpdate"
        />
      </PrimeTabPanel>

      <PrimeTabPanel>
        <template #header>
          <ReactionIcon type="celebrate" class="mr-1" size="small" />

          {{ celebrateCounts }}
        </template>

        <ReactionTabContent
          :article-id="articleId"
          :comment-id="commentId"
          reaction-type="celebrate"
          @total-counts:update="onCelebrateCountsUpdate"
        />
      </PrimeTabPanel>
    </PrimeTabView>
  </PrimeSidebar>
</template>

<script lang="ts" setup>
/* ---------------------------------- Props --------------------------------- */
interface ArticleReactionSidebarProps {
  articleId: string;
  commentId: null;
}

interface CommentReactionSideBarProps {
  articleId: null;
  commentId: string;
}

type ReactionSidebarProps =
  | ArticleReactionSidebarProps
  | CommentReactionSideBarProps;

defineProps<ReactionSidebarProps>();
/* -------------------------------------------------------------------------- */

const isVisible = defineModel<boolean>("isVisible", {
  required: true,
});

const allCounts = ref<string>("0");
const likeCounts = ref<string>("0");
const loveCounts = ref<string>("0");
const celebrateCounts = ref<string>("0");

const onAllCountsUpdate = (newValue: number) => {
  allCounts.value = toNumericAbbreviation(newValue);
};
const onLikeCountsUpdate = (newValue: number) => {
  likeCounts.value = toNumericAbbreviation(newValue);
};
const onLoveCountsUpdate = (newValue: number) => {
  loveCounts.value = toNumericAbbreviation(newValue);
};
const onCelebrateCountsUpdate = (newValue: number) => {
  celebrateCounts.value = toNumericAbbreviation(newValue);
};
</script>
