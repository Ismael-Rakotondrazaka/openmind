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

      <NuxtLink
        :to="{
          name: 'users-username',
          params: {
            username: user.username,
          },
        }"
      >
        <h1 class="font-bold text-text">
          {{ user.firstName }}&nbsp;{{ user.name }}
        </h1>
      </NuxtLink>
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

defineProps<UserListItemProps>();

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
</script>
