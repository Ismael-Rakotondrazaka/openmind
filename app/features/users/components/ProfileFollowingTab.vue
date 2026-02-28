<script lang="ts" setup>
import { Input } from '@/components/ui/input';
import { useGetFollowing } from '~/features/shared/follows/composables/useGetFollowing';
import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import ProfileUserListItem from '~/features/users/components/ProfileUserListItem.vue';

interface Props {
  profileId: string;
}

const props = defineProps<Props>();

const followingSearch = ref('');
const followingPage = ref(1);
const followingLimit = ref(10);

const { data: followingData, isPending: isFollowingPending } = useGetFollowing(
  () => ({
    follower_id: props.profileId,
    limit: followingLimit.value,
    page: followingPage.value,
  })
);

const followingTotalPages = computed(() =>
  Math.ceil((followingData.value?.count ?? 0) / followingLimit.value)
);

const filteredFollowing = computed(() => {
  const search = followingSearch.value.toLowerCase();
  return (followingData.value?.data ?? []).filter(
    f =>
      !search ||
      f.following.username?.toLowerCase().includes(search) ||
      f.following.first_name?.toLowerCase().includes(search) ||
      f.following.last_name?.toLowerCase().includes(search)
  );
});
</script>

<template>
  <div class="mt-4 flex flex-col">
    <Input
      v-model="followingSearch"
      placeholder="Search following..."
      class="mb-4"
    />

    <div v-if="isFollowingPending" class="text-muted-foreground text-sm">
      Loading...
    </div>
    <template v-else>
      <ProfileUserListItem
        v-for="follow in filteredFollowing"
        :key="follow.id"
        :user="follow.following"
      />
      <p
        v-if="!filteredFollowing.length"
        class="text-muted-foreground py-6 text-center text-sm"
      >
        No following yet.
      </p>
      <Pagination
        v-if="(followingData?.count ?? 0) > followingLimit"
        :limit="followingLimit"
        :page="followingPage"
        :total-count="followingData?.count ?? 0"
        :total-pages="followingTotalPages"
        @page-change="followingPage = $event"
        @page-size-change="followingLimit = $event"
      />
    </template>
  </div>
</template>

<style></style>
