<template>
  <InputLabel
    v-if="
      parent !== null && authUser !== null && parent.user.id === authUser.id
    "
    :is-required="true"
    :tooltip-text="tooltipText"
    :label="`Reply to your comment`"
    :label-for="labelFor"
    class="mb-3"
  />
  <InputLabel
    v-else-if="parent !== null"
    :is-required="true"
    :tooltip-text="tooltipText"
    :label="`Reply to ${parent.user.firstName} ${parent.user.name}'s comment`"
    :label-for="labelFor"
    class="mb-3"
  />
  <InputLabel
    v-if="
      parent === null && authUser !== null && article.user.id === authUser.id
    "
    :is-required="true"
    :tooltip-text="tooltipText"
    :label="`Comment to your article`"
    :label-for="labelFor"
    class="mb-3"
  />
  <InputLabel
    v-else-if="parent === null"
    :is-required="true"
    :tooltip-text="tooltipText"
    :label="`Comment to ${article.user.firstName} ${article.user.name}'s article`"
    :label-for="labelFor"
    class="mb-3"
  />
</template>

<script lang="ts" setup>
interface ICommentInputDescriptionProps {
  parent: CommentFull | null;
  article: ArticleFull;
  labelFor: string;
}

defineProps<ICommentInputDescriptionProps>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const contentMaxLengthFormatted = useNumericAbbreviation(
  commentConfig.CONTENT_MAX_LENGTH,
);

const tooltipText = computed<string>(() =>
  [
    `• ${commentConfig.CONTENT_MIN_LENGTH} characters min`,
    `• ${contentMaxLengthFormatted.value} characters max`,
  ].join("\n"),
);
</script>
