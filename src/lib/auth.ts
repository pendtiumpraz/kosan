import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            avatar?: string;
            verificationStatus: string;
            trustScore: number;
        };
    }

    interface User {
        role: UserRole;
        verificationStatus: string;
        trustScore: number;
        avatar?: string;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        verificationStatus: string;
        trustScore: number;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    // @ts-expect-error - Prisma adapter version mismatch with next-auth beta
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    pages: {
        signIn: "/login",
        signOut: "/logout",
        error: "/error",
        newUser: "/register",
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "USER" as UserRole,
                    verificationStatus: "PENDING",
                    trustScore: 5, // Email verified via Google
                };
            },
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email dan password wajib diisi");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                        deletedAt: null,
                    },
                });

                if (!user || !user.passwordHash) {
                    throw new Error("Email atau password salah");
                }

                if (!user.isActive) {
                    throw new Error("Akun Anda telah dinonaktifkan");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash
                );

                if (!isPasswordValid) {
                    throw new Error("Email atau password salah");
                }

                // Update last login
                await prisma.user.update({
                    where: { id: user.id },
                    data: { lastLoginAt: new Date() },
                });

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role as UserRole,
                    verificationStatus: user.verificationStatus,
                    trustScore: user.trustScore,
                    avatar: user.avatar || undefined,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id as string;
                token.role = user.role;
                token.verificationStatus = user.verificationStatus;
                token.trustScore = user.trustScore;
            }

            // Handle session update
            if (trigger === "update" && session) {
                token.name = session.name;
                token.role = session.role;
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as UserRole;
                session.user.verificationStatus = token.verificationStatus as string;
                session.user.trustScore = token.trustScore as number;
            }
            return session;
        },
        async signIn({ user, account }) {
            // For OAuth providers, check if user exists and update
            if (account?.provider !== "credentials") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (existingUser) {
                    // Update last login
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            lastLoginAt: new Date(),
                            emailVerifiedAt: existingUser.emailVerifiedAt || new Date(),
                        },
                    });
                }
            }
            return true;
        },
    },
    events: {
        async createUser({ user }) {
            // Log new user creation
            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: "CREATE",
                    entityType: "users",
                    entityId: user.id,
                    newData: { email: user.email, name: user.name },
                },
            });
        },
        async signIn({ user }) {
            // Log sign in
            await prisma.auditLog.create({
                data: {
                    userId: user.id,
                    action: "LOGIN",
                    entityType: "users",
                    entityId: user.id,
                },
            });
        },
    },
});
