import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = (credentials.email as string).trim().toLowerCase();
        const password = credentials.password as string;

        const { data: user, error } = await supabase
          .from("cmr_users")
          .select("id, email, name, first_name, last_name, avatar_url, password_hash")
          .eq("email", email)
          .maybeSingle();

        if (error || !user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatar_url,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth: session, request }) {
      const isLoggedIn = !!session?.user;
      const isProtected = request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/curate") ||
        request.nextUrl.pathname.startsWith("/resume") ||
        request.nextUrl.pathname.startsWith("/applications") ||
        request.nextUrl.pathname.startsWith("/profile") ||
        request.nextUrl.pathname.startsWith("/onboarding");

      if (isProtected && !isLoggedIn) {
        return false; // redirects to signIn page
      }
      return true;
    },
    async signIn({ user, account, profile }) {
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
        // Extract first/last name from Google profile, fall back to splitting user.name
        const nameParts = user.name?.split(" ") ?? [];
        const firstName =
          (profile as any)?.given_name ?? nameParts[0] ?? null;
        const lastName =
          (profile as any)?.family_name ??
          (nameParts.length > 1 ? nameParts.slice(1).join(" ") : null);

        const { error: insertError } = await supabase
          .from("cmr_users")
          .insert({
            email: user.email,
            name: user.name ?? user.email,
            first_name: firstName,
            last_name: lastName,
            avatar_url: user.image ?? null,
            provider: account.provider,
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
