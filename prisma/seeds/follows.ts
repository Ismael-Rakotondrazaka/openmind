import type { PrismaClient } from '../../prisma/generated/client/client.js';

export const seedFollows = async (prisma: PrismaClient) => {
  await prisma.follow.createMany({
    data: [
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'a9d53459-3c88-49e7-9ac8-3a4cc5d1d8ff',
        followingId: '96b5ff42-3497-4835-8b53-690f0a8c860d',
        id: 'de4dfe57-1430-4b44-b125-4c090abbe694',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'a9d53459-3c88-49e7-9ac8-3a4cc5d1d8ff',
        followingId: '4fe60168-a45d-4270-8357-81f029032764',
        id: 'bc4795ea-d285-4824-a3c3-13ad1244fb2b',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'a9d53459-3c88-49e7-9ac8-3a4cc5d1d8ff',
        followingId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
        id: '9270985b-c26c-4ede-bc49-282480fe603f',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: '96b5ff42-3497-4835-8b53-690f0a8c860d',
        followingId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
        id: 'a8c7ab2a-eae1-4ff7-b041-ef40d3163acc',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'cf4d247b-c739-4b31-a664-4e47d39e0971',
        followingId: '96b5ff42-3497-4835-8b53-690f0a8c860d',
        id: '98569b61-bb01-4049-9c2d-c8d839764a72',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'cf4d247b-c739-4b31-a664-4e47d39e0971',
        followingId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
        id: '97de44e5-9f2f-4e36-8b64-b8051058ffc7',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'cf4d247b-c739-4b31-a664-4e47d39e0971',
        followingId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
        id: 'd2a59b5e-4548-45ee-9893-73fcc9d8d567',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: '4fe60168-a45d-4270-8357-81f029032764',
        followingId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
        id: '1f5d80b0-5443-46ab-8ffe-b21b43d6726a',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: '4fe60168-a45d-4270-8357-81f029032764',
        followingId: 'd013ab0e-f56a-4c6d-8da9-1a6115f8e1ad',
        id: 'c9077b5f-4067-418a-9651-8e407f7fbcf3',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
        followingId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
        id: 'e87cae1c-fc58-4595-ae65-1301324f35e0',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
        followingId: 'a9d53459-3c88-49e7-9ac8-3a4cc5d1d8ff',
        id: '34936843-61aa-4c9c-89a1-42c77bb3da12',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
        followingId: '96b5ff42-3497-4835-8b53-690f0a8c860d',
        id: 'f9708d08-d8fc-4a6c-b1a9-37f1182f7022',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
        followingId: '4fe60168-a45d-4270-8357-81f029032764',
        id: 'ab8072e1-30d9-4386-818b-b47031633a0a',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'ffee950d-d546-4f47-8d73-75ae28602ce1',
        followingId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
        id: '611f13bb-f175-46f5-b5c9-f01dc512026a',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'dc4636fc-5b11-43b4-b248-7c6365770d26',
        followingId: 'a9d53459-3c88-49e7-9ac8-3a4cc5d1d8ff',
        id: '860c573c-7a98-4ea1-a5c2-9f86367de8b0',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: 'dc4636fc-5b11-43b4-b248-7c6365770d26',
        followingId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
        id: '79a1c8ae-9700-4464-925a-2385ae4c223d',
      },
      {
        createdAt: new Date('2024-01-15T12:00:00.000Z'),
        followerId: '99cc962e-f1a5-4fa0-9667-db4c9afc8918',
        followingId: 'db768759-d49b-4d39-95d2-d2e2ad11d593',
        id: '967be164-430b-4f5c-8e93-fc45e9d112c6',
      },
    ],
  });
};
