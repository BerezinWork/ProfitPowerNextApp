'use server';

import { registerSchema, type RegisterSchema } from "@/features/auth/model/schema";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export type RegisterState = {
    errors?: {
        [Key in keyof RegisterSchema]?: string[];
    };
    message?: string | null;
};

export async function registerUser(
    prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const validated = registerSchema.safeParse(Object.fromEntries(formData));

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: "Validation failed",
        };
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validated.data),
        });

        const data = await response.json();

        if (!response.ok) {
            return { message: data.message || 'Registration failed' };
        }

        const strCookie = response.headers.get('set-cookie');

        if (strCookie) {
            const match = strCookie.match(/refreshToken=([^;]+)/);
            const tokenValue = match ? match[1] : null;

            if (tokenValue) {
                (await cookies()).set({
                    name: 'refreshToken',
                    value: tokenValue,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    maxAge: 30 * 24 * 60 * 60,
                });
            }
        }

    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'Unknown Error';
        console.error("Register Action Error:", errMessage);
        return { message: errMessage };
    }

    redirect('/home');
}