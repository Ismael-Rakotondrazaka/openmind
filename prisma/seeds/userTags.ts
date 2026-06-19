import type { PrismaClient } from '../../prisma/generated/client/client.js';

export const seedUserTags = async (prisma: PrismaClient) => {
  await prisma.userTag.createMany({
    data: [
      {
        tagId: 'e262459b-8d51-4eae-ad5b-4b71307e32fc',
        userId: 'a9d53459-3c88-49e7-9ac8-3a4cc5d1d8ff',
      },
      {
        tagId: 'e2004ed0-b518-4dc6-8081-b4c9af7ebce2',
        userId: '96b5ff42-3497-4835-8b53-690f0a8c860d',
      },
      {
        tagId: 'e7ea65c6-2b98-46c6-acfb-1f03234bb84b',
        userId: 'd013ab0e-f56a-4c6d-8da9-1a6115f8e1ad',
      },
      {
        tagId: '57ef02be-bf52-4931-a76a-1d1e0ccdb04d',
        userId: 'd013ab0e-f56a-4c6d-8da9-1a6115f8e1ad',
      },
      {
        tagId: '1704b280-550c-4403-bc26-830555621cee',
        userId: 'b75b44eb-5509-4f06-92d6-1307e33acbe3',
      },
      {
        tagId: 'ab7ceec2-cdde-43c7-b21e-fbd0d298e1e9',
        userId: 'cf4d247b-c739-4b31-a664-4e47d39e0971',
      },
      {
        tagId: 'a13e61ea-ecf2-4b8a-9997-36d12799bc7a',
        userId: 'cf4d247b-c739-4b31-a664-4e47d39e0971',
      },
      {
        tagId: '6974a462-75c0-44f0-b90c-dc378912f068',
        userId: '63f25ce5-11cd-49b1-858e-e412248f2c2e',
      },
      {
        tagId: '60944ac8-8fb7-4776-9945-60f9694e562c',
        userId: '63f25ce5-11cd-49b1-858e-e412248f2c2e',
      },
      {
        tagId: 'd4c048ce-9d79-4739-8812-e45f527350f9',
        userId: '4fe60168-a45d-4270-8357-81f029032764',
      },
      {
        tagId: 'a72d092f-23ed-4dfd-a868-6a60f5af6e22',
        userId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
      },
      {
        tagId: '29fe5732-1fd4-4456-8e02-05812ffe00db',
        userId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
      },
      {
        tagId: '5ccae9ca-ba65-4c3d-9e87-23a65f225848',
        userId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
      },
      {
        tagId: 'e2004ed0-b518-4dc6-8081-b4c9af7ebce2',
        userId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
      },
      {
        tagId: '38e3baa9-a1c8-4a4d-b95a-fa0ea6c6378e',
        userId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
      },
      {
        tagId: '84cd6b69-f143-4180-b295-5436ec52e553',
        userId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
      },
      {
        tagId: '4d66bbc3-5107-4f2a-af45-365d92aec916',
        userId: 'dc4636fc-5b11-43b4-b248-7c6365770d26',
      },
      {
        tagId: '10a7cbf5-02f8-4fba-8fbc-ad6187f28eb7',
        userId: 'dc4636fc-5b11-43b4-b248-7c6365770d26',
      },
      {
        tagId: 'd4afe70e-c64b-4c36-afe4-46c0fe448800',
        userId: 'dc4636fc-5b11-43b4-b248-7c6365770d26',
      },
      {
        tagId: 'aa4b8d11-a00d-442f-8f01-49fdd24eb5e7',
        userId: 'dc4636fc-5b11-43b4-b248-7c6365770d26',
      },
      {
        tagId: '38e3baa9-a1c8-4a4d-b95a-fa0ea6c6378e',
        userId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
      },
      {
        tagId: 'e2004ed0-b518-4dc6-8081-b4c9af7ebce2',
        userId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
      },
      {
        tagId: 'aa4b8d11-a00d-442f-8f01-49fdd24eb5e7',
        userId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
      },
      {
        tagId: 'e7ea65c6-2b98-46c6-acfb-1f03234bb84b',
        userId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
      },
    ],
  });
};
