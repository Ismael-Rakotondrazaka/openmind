<script lang="ts" setup>
import { Input } from '@/components/ui/input';
import { useGetFollows } from '~/features/shared/follows/composables/useGetFollows';
import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import ProfileUserListItem from '~/features/users/components/ProfileUserListItem.vue';

interface Props {
  profileId: string;
}

const props = defineProps<Props>();

const followerSearch = ref('');
const followersPage = ref(1);
const followersLimit = ref(10);

const { data: followersData, isPending: isFollowersPending } = useGetFollows(
  () => ({
    following_id: props.profileId,
    limit: followersLimit.value,
    page: followersPage.value,
  })
);

const followersTotalPages = computed(() =>
  Math.ceil((followersData.value?.count ?? 0) / followersLimit.value)
);

const filteredFollowers = computed(() => {
  const search = followerSearch.value.toLowerCase();
  return (followersData.value?.data ?? []).filter(
    f =>
      !search ||
      f.follower.username?.toLowerCase().includes(search) ||
      f.follower.first_name?.toLowerCase().includes(search) ||
      f.follower.last_name?.toLowerCase().includes(search)
  );
});
</script>

<template>
  <div class="mt-4 flex flex-col">
    <Input
      v-model="followerSearch"
      placeholder="Search followers..."
      class="mb-4"
    />

    <div v-if="isFollowersPending" class="text-muted-foreground text-sm">
      Loading...
    </div>
    <template v-else>
      <ProfileUserListItem
        v-for="follow in filteredFollowers"
        :key="follow.id"
        :user="follow.follower"
      />
      <p
        v-if="!filteredFollowers.length"
        class="text-muted-foreground py-6 text-center text-sm"
      >
        No followers yet.
      </p>
      <Pagination
        v-if="(followersData?.count ?? 0) > followersLimit"
        :limit="followersLimit"
        :page="followersPage"
        :total-count="followersData?.count ?? 0"
        :total-pages="followersTotalPages"
        @page-change="followersPage = $event"
        @page-size-change="followersLimit = $event"
      />
    </template>
  </div>
</template>

<style></style>
