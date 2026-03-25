import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            hasCompletedOnboarding: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        role: string;
        hasCompletedOnboarding: boolean;
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email });

                // Note: we use user.comparePassword method defined in the schema
                if (!user || !(await user.comparePassword(credentials.password))) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    hasCompletedOnboarding: user.hasCompletedOnboarding,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.hasCompletedOnboarding = user.hasCompletedOnboarding;
            }

            // Update token if session is explicitly updated (e.g., after onboarding)
            if (trigger === "update" && session?.hasCompletedOnboarding !== undefined) {
                token.hasCompletedOnboarding = session.hasCompletedOnboarding;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.hasCompletedOnboarding = token.hasCompletedOnboarding as boolean;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
