<template>
  <PrimeTabView class="items-stretch">
    <PrimeTabPanel>
      <template #header>
        <span>{{ formattedArticlesCount }} Articles</span>
      </template>

      <template #default>
        <ArticleTabContent :user-id="user.id" />
      </template>
    </PrimeTabPanel>

    <PrimeTabPanel>
      <template #header>
        <span>{{ formattedFollowersCount }} Followers</span>
      </template>

      <template #default>
        <FollowerTabContent :user-id="user.id" />
      </template>
    </PrimeTabPanel>

    <PrimeTabPanel>
      <template #header>
        <span>{{ formattedFollowingCount }} Following</span>
      </template>

      <template #default>
        <FollowingTabContent :user-id="user.id" />
      </template>
    </PrimeTabPanel>
  </PrimeTabView>
</template>

<script setup lang="ts">
const { user } = inject(ShowUserToken) as ShowUserDI;

const formattedArticlesCount = useNumericAbbreviation(
  () => user.value._count.articles,
);

const formattedFollowersCount = useNumericAbbreviation(
  () => user.value._count.followers,
);

const formattedFollowingCount = useNumericAbbreviation(
  () => user.value._count.following,
);
</script>

<style scoped></style>
