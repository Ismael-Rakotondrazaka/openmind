import type { PrismaClient } from '../../prisma/generated/client/client.js';

export const seedTags = async (prisma: PrismaClient) => {
  await prisma.tag.createMany({
    data: [
      {
        id: '8e0a9ced-854f-40e2-aa8b-9a4e16d3169d',
        slug: 'web-development',
        value: 'web development',
      },
      {
        id: '7739b7b6-f7f6-4857-9d89-00af25fa4555',
        slug: 'programming',
        value: 'programming',
      },
      {
        id: '3fd3f9e4-b4a0-4adc-9b7b-080713493567',
        slug: 'trends',
        value: 'trends',
      },
      {
        id: '57ef02be-bf52-4931-a76a-1d1e0ccdb04d',
        slug: 'travel',
        value: 'travel',
      },
      {
        id: 'e2004ed0-b518-4dc6-8081-b4c9af7ebce2',
        slug: 'destinations',
        value: 'destinations',
      },
      {
        id: '0c893d3f-159b-40a3-a5b1-48b540c55902',
        slug: 'adventure',
        value: 'adventure',
      },
      {
        id: '850f0eac-3e08-4014-89d1-b3f6b7cf4866',
        slug: 'vegan',
        value: 'vegan',
      },
      {
        id: 'd4c048ce-9d79-4739-8812-e45f527350f9',
        slug: 'recipes',
        value: 'recipes',
      },
      {
        id: '510d70e1-f0f0-4b9e-a56e-698cb168c865',
        slug: 'food',
        value: 'food',
      },
      {
        id: '92867692-d463-485b-a796-079ccf1bb9fa',
        slug: 'work-life-balance',
        value: 'work-life balance',
      },
      {
        id: 'b9a50148-63b9-46a7-af93-7b1a51df1587',
        slug: 'remote-work',
        value: 'remote work',
      },
      {
        id: '21a170b5-bc78-4dda-8d49-927d84d09c1d',
        slug: 'health',
        value: 'health',
      },
      {
        id: '5ccae9ca-ba65-4c3d-9e87-23a65f225848',
        slug: 'artificial-intelligence',
        value: 'artificial intelligence',
      },
      {
        id: 'fa2e6f86-bf09-45e7-ac13-e52c014d2d5c',
        slug: 'technology',
        value: 'technology',
      },
      {
        id: '60905e22-6e27-40b2-9387-55d1407210ca',
        slug: 'innovation',
        value: 'innovation',
      },
      {
        id: '4d66bbc3-5107-4f2a-af45-365d92aec916',
        slug: 'personal-finance',
        value: 'personal finance',
      },
      {
        id: 'eac4d609-e8c5-4043-8725-432005795f78',
        slug: 'budgeting',
        value: 'budgeting',
      },
      {
        id: 'c727bbf4-6ce3-4ba4-81d8-82a8e8e9ac83',
        slug: 'investing',
        value: 'investing',
      },
      {
        id: '8af24df2-aa54-4f54-9a50-b80d97aa5aba',
        slug: 'minimalism',
        value: 'minimalism',
      },
      {
        id: '6ccb393b-e050-4fa5-addc-5b48e5249842',
        slug: 'lifestyle',
        value: 'lifestyle',
      },
      {
        id: 'b7d76965-8e45-4764-95a1-c85e0e61cfab',
        slug: 'happiness',
        value: 'happiness',
      },
      {
        id: '29fe5732-1fd4-4456-8e02-05812ffe00db',
        slug: 'meditation',
        value: 'meditation',
      },
      {
        id: 'aa4b8d11-a00d-442f-8f01-49fdd24eb5e7',
        slug: 'well-being',
        value: 'well-being',
      },
      {
        id: 'ba51a7f3-702a-4da2-94b1-ef154b25405b',
        slug: 'mental-health',
        value: 'mental health',
      },
      {
        id: 'faf86a9c-9828-4093-a1f6-013ac40f3df1',
        slug: 'exercise',
        value: 'exercise',
      },
      {
        id: 'a3ac9ca5-078f-4eee-8d09-cef698cc7d87',
        slug: 'fitness',
        value: 'fitness',
      },
      {
        id: '5dde43c4-8fbb-454c-a32c-63b8bae9f092',
        slug: 'cryptocurrency',
        value: 'cryptocurrency',
      },
      {
        id: '1650bd01-a2bf-4ee0-bdc5-fd53aaec8874',
        slug: 'finance',
        value: 'finance',
      },
      {
        id: '10a7cbf5-02f8-4fba-8fbc-ad6187f28eb7',
        slug: 'investment',
        value: 'investment',
      },
      {
        id: '0772c78d-587e-4cc8-8ad4-e84cea16108a',
        slug: 'sustainability',
        value: 'sustainability',
      },
      {
        id: '60944ac8-8fb7-4776-9945-60f9694e562c',
        slug: 'environment',
        value: 'environment',
      },
      {
        id: '1704b280-550c-4403-bc26-830555621cee',
        slug: 'green-living',
        value: 'green living',
      },
      {
        id: 'dda82aa7-9df3-4760-945a-70dd41969814',
        slug: 'home-organization',
        value: 'home organization',
      },
      {
        id: 'b2e18e4e-3eef-43c3-8157-81e5c7923afa',
        slug: 'decluttering',
        value: 'decluttering',
      },
      {
        id: '15413666-526d-4b19-89fe-90dc5213abcb',
        slug: 'cleaning',
        value: 'cleaning',
      },
      {
        id: '9041cec8-7484-4da7-833f-8894e3210151',
        slug: 'healthy-diet',
        value: 'healthy diet',
      },
      {
        id: '56e39e5a-2f07-4b55-ae09-3d488a5b7bbe',
        slug: 'nutrition',
        value: 'nutrition',
      },
      {
        id: 'e57715c4-e478-4bd2-a70b-6b9d4cb71e87',
        slug: 'time-management',
        value: 'time management',
      },
      {
        id: '84cd6b69-f143-4180-b295-5436ec52e553',
        slug: 'productivity',
        value: 'productivity',
      },
      {
        id: 'deb3ebf0-6919-4051-8e57-84386749162b',
        slug: 'efficiency',
        value: 'efficiency',
      },
      {
        id: '6974a462-75c0-44f0-b90c-dc378912f068',
        slug: 'yoga',
        value: 'yoga',
      },
      {
        id: '787d57ac-37ef-4c91-9240-6ab48e72e29d',
        slug: 'gardening',
        value: 'gardening',
      },
      {
        id: 'ab7ceec2-cdde-43c7-b21e-fbd0d298e1e9',
        slug: 'plants',
        value: 'plants',
      },
      {
        id: '5a5c4adc-a872-4d2c-8fb1-bf1ab9651ff3',
        slug: 'outdoors',
        value: 'outdoors',
      },
      {
        id: '63807906-4cca-478e-a852-5a4395ebf265',
        slug: 'budget',
        value: 'budget',
      },
      {
        id: 'd4afe70e-c64b-4c36-afe4-46c0fe448800',
        slug: 'hydration',
        value: 'hydration',
      },
      {
        id: '7d1b353a-59dc-4fac-ab88-630bc8865570',
        slug: 'water',
        value: 'water',
      },
      {
        id: '9a4df7b4-092f-4aa4-ad6a-9cfd50b5a9e6',
        slug: 'mindfulness',
        value: 'mindfulness',
      },
      {
        id: 'e262459b-8d51-4eae-ad5b-4b71307e32fc',
        slug: 'healthy-cooking',
        value: 'healthy cooking',
      },
      {
        id: '99aea1ee-f520-4a04-9b4e-8703a63546a1',
        slug: 'financial-planning',
        value: 'financial planning',
      },
      {
        id: '907227ca-8f72-4c79-a5a5-9f66a07e0f80',
        slug: 'self-care',
        value: 'self-care',
      },
      {
        id: '9c7cfc46-de45-44a5-ba09-b66175d22c18',
        slug: 'support',
        value: 'support',
      },
      {
        id: '38e3baa9-a1c8-4a4d-b95a-fa0ea6c6378e',
        slug: 'simplicity',
        value: 'simplicity',
      },
      {
        id: 'f00ea8b5-1503-4953-a5c7-9b73c7daaec7',
        slug: 'reading',
        value: 'reading',
      },
      {
        id: 'a72d092f-23ed-4dfd-a868-6a60f5af6e22',
        slug: 'books',
        value: 'books',
      },
      {
        id: 'a13e61ea-ecf2-4b8a-9997-36d12799bc7a',
        slug: 'workout',
        value: 'workout',
      },
      {
        id: 'e7ea65c6-2b98-46c6-acfb-1f03234bb84b',
        slug: 'home-exercise',
        value: 'home exercise',
      },
    ],
  });
};
