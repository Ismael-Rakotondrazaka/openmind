<script lang="ts" setup>
import { useQuery } from '@pinia/colada';
import { useI18n } from 'vue-i18n';

import { Input } from '@/components/ui/input';
import { followListQuery } from '~/features/shared/follows/follow.query';
import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import ProfileUserListItem from '~/features/users/components/ProfileUserListItem.vue';

interface Props {
  profileId: string;
}

const props = defineProps<Props>();

const { t } = useI18n();

const followerSearch = ref('');
const followersPage = ref(1);
const followersLimit = ref(10);

const fetchFn = useRequestFetch();

const { data: followersData, isLoading: isFollowersPending } = useQuery(() =>
  followListQuery({
    fetchFn,
    followingId: props.profileId,
    page: followersPage.value,
    pageSize: followersLimit.value,
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
      f.follower.firstName?.toLowerCase().includes(search) ||
      f.follower.lastName?.toLowerCase().includes(search)
  );
});
</script>

<template>
  <div class="mt-4 flex flex-col">
    <Input
      v-model="followerSearch"
      :placeholder="t('common.search.placeholderFollowers')"
      class="mb-4"
    />

    <div v-if="isFollowersPending" class="text-muted-foreground text-sm">
      {{ t('users.loadingMessage') }}
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
        {{ t('users.noFollowersYet') }}
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
