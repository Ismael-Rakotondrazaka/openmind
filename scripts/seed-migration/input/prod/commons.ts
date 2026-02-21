import { customAlphabet } from 'nanoid';

export const createIdentifier = customAlphabet(
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
);
