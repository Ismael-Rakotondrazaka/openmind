import { Scrypt } from '@adonisjs/hash/drivers/scrypt';

const scrypt = new Scrypt({});

export const hashSeedPassword = (): Promise<string> => scrypt.make('password');
