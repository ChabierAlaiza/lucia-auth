import { Lucia } from 'lucia'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { prisma } from './prisma'
import { cookies } from 'next/headers'

const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: 'chabidev-auth-cookie',
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === 'production',
        }
    },
    getUserAttributes(attributes) {
        return {
            id: attributes.id,
            email: attributes.email,
            name: attributes.name,
            role: attributes.role
        }
    },
})

export const getUser = async () => {
    const sessionId = await cookies().get(lucia.sessionCookieName)?.value || null

    if (!sessionId) return null

    const { session, user } = await lucia.validateSession(sessionId)

    try {
        if (session && session.fresh) {
            const sessionCookie = await lucia.createSessionCookie(session.id)
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }
        if (!session) {
            const sessionCookie = await lucia.createBlankSessionCookie()
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        }
    } catch (error) {

    }

    return user
}

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia
        DatabaseUserAttributes: DatabaseUserAttributes
    }

    interface DatabaseUserAttributes {
        id: string,
        email: string,
        name: string,
        role: string
    }
}