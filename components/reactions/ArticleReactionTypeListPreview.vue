<template>
  <PrimeAvatarGroup>
    <PrimeAvatar v-if="haveLike" shape="circle">
      <ReactionIcon type="like" size="small" />
    </PrimeAvatar>
    <PrimeAvatar v-if="haveLove" shape="circle">
      <ReactionIcon type="love" size="small" />
    </PrimeAvatar>
    <PrimeAvatar v-if="haveCelebrate" shape="circle">
      <ReactionIcon type="celebrate" size="small" class="translate-y-px" />
    </PrimeAvatar>
  </PrimeAvatarGroup>
</template>

<script lang="ts" setup>
interface ArticleReactionTypeListPreviewProps {
  reactions: ReactionFull[];
}

const props = defineProps<ArticleReactionTypeListPreviewProps>();

const haveReactions = computed<boolean>(() => props.reactions.length > 0);

const haveReactionType = (reactionType: ReactionType): boolean =>
  props.reactions.findIndex((reaction) => reaction.type === reactionType) >= 0;

const haveLike = computed<boolean>(
  () => haveReactions.value && haveReactionType("like"),
);
const haveLove = computed<boolean>(
  () => haveReactions.value && haveReactionType("love"),
);
const haveCelebrate = computed<boolean>(
  () => haveReactions.value && haveReactionType("celebrate"),
);
</script>
