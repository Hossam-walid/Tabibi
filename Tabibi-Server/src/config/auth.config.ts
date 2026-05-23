import { betterAuth } from 'better-auth';
import { organization, customSession, bearer } from 'better-auth/plugins';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import prisma from './prisma.config.js';

const getBaseURL = () => {
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return process.env.BETTER_AUTH_URL || 'http://localhost:3000';
};

const isProduction = process.env.NODE_ENV === 'production';

const getTrustedOrigins = (): string[] => {
    const defaults = [
        'http://localhost:5173',
        'http://localhost:5174', 
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:5176',
        'http://127.0.0.1:3000',
        'https://tabibi-client.vercel.app',
        'https://tabibi-admin.vercel.app',
        'https://tabibi-server.vercel.app'
    ];
    
    if (process.env.CORS_ORIGIN) {
        const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
        return [...new Set([...defaults, ...envOrigins])];
    }
    
    return defaults;
};

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    baseURL: getBaseURL(),
    trustedOrigins: getTrustedOrigins(),
    cookiePrefix: 'tabibi-auth',
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    socialProviders: {
        google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET
            }
            : undefined
    },
    advanced: {
        defaultCookieAttributes: {
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            partitioned: isProduction
        },
        useSecureCookies: isProduction
    },
    plugins: [
        bearer(),
        organization({
            allowUserToCreateOrganization: true,
            organizationLimit: 10,
            membershipLimit: 100,
            invitationExpiresIn: 60 * 60 * 24 * 7,
            accessControl: {
                enabled: false
            }
        }),
        customSession(async ({ user, session }) => {
            const membership = await prisma.member.findFirst({
                where: { userId: user.id },
                orderBy: { createdAt: 'desc' }
            });

            return {
                user,
                session,
                activeOrganizationId: membership?.organizationId || null
            };
        })
    ],
    databaseHooks: {
        session: {
            create: {
                before: async (session) => {
                    const membership = await prisma.member.findFirst({
                        where: { userId: session.userId },
                        orderBy: { createdAt: 'asc' }
                    });

                    if (!membership) {
                        return { data: session };
                    }

                    return {
                        data: {
                            ...session,
                            activeOrganizationId: membership.organizationId
                        }
                    };
                }
            }
        }
    }
});

export type Auth = typeof auth;
