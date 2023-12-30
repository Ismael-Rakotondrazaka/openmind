import { PrismaClient } from "@prisma/client";

export const prisma: PrismaClient = new PrismaClient();

declare module "h3" {
  interface H3EventContext {
    prisma: PrismaClient;
  }
}

export default eventHandler((event) => {
  event.context.prisma = prisma;
});
