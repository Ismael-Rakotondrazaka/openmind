import CredentialsProvider from "next-auth/providers/credentials";
import type { Role, User } from "@prisma/client";
import { NuxtAuthHandler } from "#auth";
import { prisma } from "~/server/middleware/0.prisma";
import { StoreLoginBodySchema } from "~/utils";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  pages: {
    signIn: "/signin",
  },
  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {
        usernameOrEmail: {
          label: "Username or email",
          type: "text",
          placeholder: "(hint: jsmith)",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "(hint: hunter2)",
        },
      },
      authorize: async (credentials: any) => {
        const storeLoginSPR = StoreLoginBodySchema.safeParse(credentials);

        if (storeLoginSPR.success) {
          const user: User | null = await prisma.user.findFirst({
            where: {
              AND: {
                deletedAt: null,
                emailVerifiedAt: {
                  not: null,
                },
                OR: [
                  {
                    email: storeLoginSPR.data.usernameOrEmail,
                  },
                  {
                    username: storeLoginSPR.data.usernameOrEmail,
                  },
                ],
              },
            },
          });

          if (
            user !== null &&
            typeof credentials?.password === "string" &&
            comparePassword(credentials.password, user.password)
          ) {
            return {
              id: user.id,
              username: user.username,
              name: user.name,
              firstName: user.firstName,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session: ({ session, token }) => {
      // TODO make type accessible to front end
      type SessionUserData = {
        id: number;
        name: string;
        firstName: string;
        role: Role;
      };

      (session.user as any) = token.user as SessionUserData;

      return session;
    },
    jwt: ({ token, user, account }) => {
      if (account && user) {
        return {
          ...token,
          user,
        };
      }
      return token;
    },
  },
});
