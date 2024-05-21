import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@prisma/client";
import { NuxtAuthHandler } from "#auth";
import { StoreLoginBodySchema } from "~/utils";
import { userRepository } from "~/repositories";

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  pages: {
    signIn: "/signin",
  },
  providers: [
    // @ts-expect-error compatibility problem with next-auth
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
      authorize: async (credentials: unknown) => {
        const storeLoginSPR = StoreLoginBodySchema.safeParse(credentials);

        if (storeLoginSPR.success) {
          const user: User | null = await userRepository.findOne({
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
            typeof credentials === "object" &&
            credentials !== null &&
            "password" in credentials &&
            typeof credentials?.password === "string" &&
            comparePassword(credentials.password, user.password)
          ) {
            const userFull: UserFull | null = await userRepository.findFullOne({
              authUser: user,
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

            return userFull;
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
      (session.user as UserFull) = token.user as UserFull;

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
