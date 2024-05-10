<template>
  <div class="w-full max-w-2xl mx-auto my-7">
    <main class="mb-5 text-center">
      <UserAvatar size="2xlarge" :user="user" preview class="mb-3" />

      <h1
        class="mb-2 text-2xl font-extrabold leading-tight text-text dark:text-white"
      >
        {{ user.firstName }} {{ user.name }}
      </h1>

      <h2 class="mb-4 text-lg text-text-secondary">{{ user.username }}</h2>
    </main>

    <div class="flex items-center justify-between">
      <div class="flex items-start justify-start gap-5">
        <FollowingButton
          v-if="user._auth.follower !== null"
          :follow="user._auth.follower"
          @follows:destroy="onFollowDestroyHandler"
        />
        <FollowButton
          v-else-if="authUser !== null && user.id !== authUser.id"
          :user="user"
          @follows:store="onFollowStoreHandler"
        />
        <PrimeButton
          v-if="authUser !== null && user.id === authUser.id"
          label="New article"
          icon="pi pi-plus"
          @click="onNewArticleHandler"
        />

        <ShareUserButton :user="user" />
      </div>

      <UserProfileOptionsButton :user="user" />
    </div>

    <div v-if="authUser !== null && user.id === authUser.id">
      <PrimeDivider />

      <p class="mb-3 text-text font-bold">Tags preference:</p>

      <TagList :tags="user.tags" class="text-left" />
    </div>

    <PrimeDivider />

    <ShowUserTabView />
  </div>
</template>

<script lang="ts" setup>
import { ShowUserToken } from "~/di";

const { user } = inject(ShowUserToken) as ShowUserDI;

const { user: authUser } = useAuthUser();

const onFollowDestroyHandler = () => {
  user.value._auth.follower = null;
};

const onFollowStoreHandler = (newFollow: FollowFull) => {
  user.value._auth.follower = newFollow;
};

const onNewArticleHandler = () => {
  navigateTo({
    name: "articles-create",
  });
};
</script>
