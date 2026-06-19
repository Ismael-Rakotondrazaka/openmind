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

const followingSearch = ref('');
const followingPage = ref(1);
const followingLimit = ref(10);

const fetchFn = useRequestFetch();

const { data: followingData, isLoading: isFollowingPending } = useQuery(() =>
  followListQuery({
    fetchFn,
    followerId: props.profileId,
    page: followingPage.value,
    pageSize: followingLimit.value,
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
      f.following.firstName?.toLowerCase().includes(search) ||
      f.following.lastName?.toLowerCase().includes(search)
  );
});
</script>

<template>
  <div class="mt-4 flex flex-col">
    <Input
      v-model="followingSearch"
      :placeholder="t('common.search.placeholderFollowing')"
      class="mb-4"
    />

    <div v-if="isFollowingPending" class="text-muted-foreground text-sm">
      {{ t('users.loadingMessage') }}
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
        {{ t('users.noFollowingYet') }}
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
