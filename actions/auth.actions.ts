'use server'

import { signInSchema, signUpSchema } from "@/lib/zod";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { lucia } from "@/lib/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
    try {
        // si el usuario ya existe, se lanza un error
        const existingUser = await prisma.user.findUnique({
            where: {
                email: values.email,
            },
        });
        if (existingUser) {
            return { error: "El correo electrónico ya existe", success: false };
        }

        // si el usuario no existe, se crea
        const hashedPassword = await bcrypt.hash(values.password, 10);

        const user = await prisma.user.create({
            data: {
                email: values.email.toLowerCase(),
                name: values.name,
                password: hashedPassword
            }
        });

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = await lucia.createSessionCookie(session.id)
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return { success: true }
    } catch (error) {
        return { error: "Error al crear el usuario", success: false }
    }
}

export const signIn = async (value: z.infer<typeof signInSchema>) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: value.email.toLowerCase(),
            },
        });

        if (!user || !user.password) {
            return { error: "Datos de acceso incorrectos", success: false };
        }

        const passwordMatch = await bcrypt.compare(value.password, user.password);

        if (!passwordMatch) {
            return { error: "Datos de acceso incorrectos", success: false };
        }

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = await lucia.createSessionCookie(session.id)
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
        return { success: true }
    } catch (error) {
        return { error: "Error al iniciar sesión", success: false }
    }
}

export const signOut = async () => {
    const sessionCookie = await lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    return redirect('/auth')
}
