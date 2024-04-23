<template>
  <li class="flex items-center justify-between w-full">
    <div class="flex items-center justify-start gap-5">
      <NuxtLink
        :to="{
          name: 'users-username',
          params: {
            username: user.username,
          },
        }"
      >
        <UserAvatar size="large" :user="user" />
      </NuxtLink>

      <div>
        <NuxtLink
          :to="{
            name: 'users-username',
            params: {
              username: user.username,
            },
          }"
          class="text-text hover:text-primary hover:underline"
        >
          <p class="font-bold">{{ user.firstName }}&nbsp;{{ user.name }}</p>
        </NuxtLink>

        <p class="text-sm text-text-secondary">
          <span class="font-bold">{{ postsCountFormatted }}</span> articles •
          <span class="font-bold">{{ followersCountFormatted }}</span> followers
        </p>
      </div>
    </div>

    <FollowButton
      v-if="
        authUser !== null &&
        user._auth.follower === null &&
        user.id !== authUser.id
      "
      :user="user"
      size="small"
      @follows:store="onFollowsStoreHandler"
    />
  </li>
</template>

<script lang="ts" setup>
type UserListItemProps = {
  user: UserFull;
};

const props = defineProps<UserListItemProps>();

type UserListItemEmits = {
  "users:update": [number, UseMutateUserListUpdateData];
};
const emit = defineEmits<UserListItemEmits>();

const { user: authUser } = inject(AuthUserToken) as AuthUserDI;

const onFollowsStoreHandler = (newFollow: FollowFull) => {
  emit("users:update", newFollow.following.id, {
    "_auth.follower": newFollow,
  });
};

const postsCountFormatted = useNumericAbbreviation(
  () => props.user._count.articles,
);

const followersCountFormatted = useNumericAbbreviation(
  () => props.user._count.followers,
);
</script>
