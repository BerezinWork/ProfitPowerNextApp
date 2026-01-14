'use server'

import { redirect } from "next/navigation";
import { loginSchema, type LoginSchema } from "@/features/auth/model/login-schema";
import { setRefreshTokenFromHeader } from "@/shared/lib/auth-cookie";

type LoginState = {
    errors?: {
        [Key in keyof LoginSchema]?: string[];
    },
    message?: string | null;
}

export async function loginUser(
    prevState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const validated = loginSchema.safeParse(Object.fromEntries(formData));
    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            message: 'Validation failed.',
        }
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(validated.data),
        })

        const data = await response.json();

        if (!response.ok) {
            return {message: data.message || 'Login failed'};
        }

        await setRefreshTokenFromHeader(response);

    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'Unknown Error';
        console.error("Login Action Error:", errMessage);
        return { message: errMessage };
    }
    redirect('/home');
}