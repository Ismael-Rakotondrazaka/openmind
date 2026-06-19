import { createConsola } from 'consola';

export const logger = createConsola({
  formatOptions: {
    date: true,
  },
  level: process.env.NODE_ENV === 'production' ? 3 : 4,
}).withTag('campus-flow');
