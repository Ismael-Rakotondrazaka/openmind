<template>
  <div class="flex items-center gap-3">
    <div class="relative">
      <PrimeAvatar
        v-if="reaction.user.profileUrl === null"
        :label="firstNameLetter"
        shape="circle"
        size="large"
      />
      <PrimeAvatar
        v-else
        :image="reaction.user.profileUrl"
        shape="circle"
        size="large"
      />

      <ReactionIcon
        :type="reaction.type"
        size="small"
        class="absolute -bottom-1 -right-1"
      />
    </div>

    <NuxtLink
      :to="{
        name: 'index',
      }"
      class="hover:text-[--primary-color] hover:underline"
      >{{ fullName }}</NuxtLink
    >
  </div>
</template>

<script lang="ts" setup>
interface ReactionItemProps {
  reaction: ReactionFull;
}

const props = defineProps<ReactionItemProps>();

const firstNameLetter = computed(() =>
  props.reaction.user.firstName[0].toUpperCase(),
);

const fullName = computed(
  () => `${props.reaction.user.firstName} ${props.reaction.user.name}`,
);
</script>
