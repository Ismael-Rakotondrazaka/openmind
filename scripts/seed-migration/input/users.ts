export interface SeedUser {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  username: string;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export const seedUsers: SeedUser[] = [
  {
    email: 'alice@example.com',
    first_name: 'Alice',
    last_name: 'Smith',
    role: 'admin',
    username: 'alice',
  },
  {
    email: 'bob@example.com',
    first_name: 'Bob',
    last_name: 'Jones',
    role: 'user',
    username: 'bob',
  },
  {
    email: 'carol@example.com',
    first_name: 'Carol',
    last_name: 'Williams',
    role: 'user',
    username: 'carol',
  },
  {
    email: 'dave@example.com',
    first_name: 'Dave',
    last_name: 'Brown',
    role: 'user',
    username: 'dave',
  },
  {
    email: 'eve@example.com',
    first_name: 'Eve',
    last_name: 'Davis',
    role: 'moderator',
    username: 'eve',
  },
  {
    email: 'frank@example.com',
    first_name: 'Frank',
    last_name: 'Miller',
    role: 'user',
    username: 'frank',
  },
  {
    email: 'grace@example.com',
    first_name: 'Grace',
    last_name: 'Wilson',
    role: 'user',
    username: 'grace',
  },
  {
    email: 'henry@example.com',
    first_name: 'Henry',
    last_name: 'Taylor',
    role: 'user',
    username: 'henry',
  },
  {
    email: 'ivy@example.com',
    first_name: 'Ivy',
    last_name: 'Anderson',
    role: 'user',
    username: 'ivy',
  },
  {
    email: 'jack@example.com',
    first_name: 'Jack',
    last_name: 'Thomas',
    role: 'user',
    username: 'jack',
  },
  {
    email: 'john.doe@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'user',
    username: 'johndoe',
  },
];
