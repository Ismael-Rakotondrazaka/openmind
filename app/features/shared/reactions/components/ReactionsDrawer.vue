<script lang="ts"></script>

<script setup lang="ts">
import { computed, watch } from 'vue';

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Pagination from '~/features/shared/paginations/components/Pagination.vue';
import PaginationSkeleton from '~/features/shared/paginations/components/PaginationSkeleton.vue';

import { useGetReactionsWithUsers } from '../composables/useGetReactionsWithUsers';
import {
  ReactionStatusIcon,
  type ReactionType,
  ReactionTypes,
} from '../reaction.model';
import ReactionList from './ReactionList.vue';
import ReactionListSkeleton from './ReactionListSkeleton.vue';

interface props {
  postId: string;
  reactionsDetails: Partial<Record<ReactionType, number>>;
}

const ReactionTabs = ['all', ...ReactionTypes] as const;
const ReactionTab = createEnumConstants(ReactionTabs);
type ReactionTab = (typeof ReactionTab)[keyof typeof ReactionTab];

const props = defineProps<props>();

const open = defineModel<boolean>('open', {
  default: false,
  required: false,
});

const selectedReactionTab = defineModel<ReactionTab>('selectedReactionTab', {
  default: 'all',
  required: false,
});

const page = useRouteQuery('reactionsPage', 1, { transform: Number });
const limit = useRouteQuery('reactionsLimit', 10, { transform: Number });

watch(selectedReactionTab, () => {
  page.value = 1;
});

const { data, isPending } = useGetReactionsWithUsers(() => ({
  limit: limit.value,
  page: page.value,
  post_id: props.postId,
  type:
    selectedReactionTab.value === 'all'
      ? undefined
      : (selectedReactionTab.value as ReactionType),
}));

const totalPages = computed(() =>
  Math.ceil((data.value?.count ?? 0) / limit.value)
);
</script>

<template>
  <div>
    <Drawer v-model:open="open" direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Reactions</DrawerTitle>
        </DrawerHeader>

        <div class="flex w-full flex-col gap-6 px-3">
          <Tabs v-model="selectedReactionTab" default-value="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger
                v-for="reactionType in ReactionTypes"
                :key="reactionType"
                :value="reactionType"
              >
                <Icon
                  :name="
                    selectedReactionTab === 'all' ||
                    selectedReactionTab !== reactionType
                      ? ReactionStatusIcon.inactive[reactionType]
                      : ReactionStatusIcon.active[reactionType]
                  "
                />
                {{ toNumericAbbreviation(reactionsDetails[reactionType] ?? 0) }}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ReactionListSkeleton v-if="isPending" />
              <ReactionList v-else-if="data" :reactions="data.data" />
            </TabsContent>

            <TabsContent
              v-for="reactionType in ReactionTypes"
              :key="reactionType"
              :value="reactionType"
            >
              <ReactionListSkeleton v-if="isPending" />
              <ReactionList v-else-if="data" :reactions="data.data" />
            </TabsContent>
          </Tabs>
        </div>

        <DrawerFooter>
          <PaginationSkeleton v-if="isPending" compact />
          <Pagination
            v-else
            compact
            :limit="limit"
            :page="page"
            :total-count="data?.count ?? 0"
            :total-pages="totalPages"
            @page-change="page = $event"
            @page-size-change="limit = $event"
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
