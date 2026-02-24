<script lang="ts"></script>

<script setup lang="ts">
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  ReactionStatusIcon,
  type ReactionType,
  ReactionTypes,
} from '../reaction.model';
import ReactionListSection from './ReactionListSection.vue';

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
              <ReactionListSection :post-id="postId" />
            </TabsContent>

            <TabsContent
              v-for="reactionType in ReactionTypes"
              :key="reactionType"
              :value="reactionType"
            >
              <ReactionListSection :post-id="postId" :type="reactionType" />
            </TabsContent>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
