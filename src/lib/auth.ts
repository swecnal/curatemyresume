import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import { supabase } from "@/lib/supabase";

import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      cmr_user_id: string;
      email: string;
      name: string;
      image?: string | null;
      tier: string;
      curations_this_month: number;
      current_period_start: string;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    cmr_user_id?: string;
    tier?: string;
    curations_this_month?: number;
    current_period_start?: string;
  }
}

const config: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      // Check if user already exists in cmr_users
      const { data: existingUser, error: fetchError } = await supabase
        .from("cmr_users")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking cmr_users:", fetchError);
        return false;
      }

      // Create new user if they don't exist
      if (!existingUser) {
        const { error: insertError } = await supabase
          .from("cmr_users")
          .insert({
            email: user.email,
            name: user.name ?? user.email,
            avatar_url: user.image ?? null,
            provider: account.provider,
            provider_account_id: account.providerAccountId,
            tier: "free",
            curations_this_month: 0,
            current_period_start: new Date().toISOString(),
          });

        if (insertError) {
          console.error("Error creating cmr_users row:", insertError);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, trigger }) {
      if (!token.email) return token;

      // Refresh user data from DB on initial sign-in, explicit update, or first load
      const shouldRefresh =
        !token.cmr_user_id || trigger === "signIn" || trigger === "update";

      if (shouldRefresh) {
        const { data: dbUser } = await supabase
          .from("cmr_users")
          .select("id, tier, curations_this_month, current_period_start")
          .eq("email", token.email)
          .maybeSingle();

        if (dbUser) {
          token.cmr_user_id = dbUser.id;
          token.tier = dbUser.tier;
          token.curations_this_month = dbUser.curations_this_month;
          token.current_period_start = dbUser.current_period_start;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.user.cmr_user_id = token.cmr_user_id ?? "";
      session.user.tier = token.tier ?? "free";
      session.user.curations_this_month = token.curations_this_month ?? 0;
      session.user.current_period_start =
        token.current_period_start ?? new Date().toISOString();

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
