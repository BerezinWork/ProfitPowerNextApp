import { z } from "zod";

export const registerSchema = z.object({
    nickname: z
        .string()
        .min(3, { message: ">> Nickname required" })
        .max(20, { message: ">> Maximum 20 chars" })
        .regex(/^[a-zA-Z]/, { message: ">> Must start with a letter" })
        .regex(/^[a-zA-Z0-9_-]+$/, { message: ">> Only letters, numbers, '-' and '_'" }),

    email: z
        .string()
        .min(1, { message: ">> Email required" })
        .email({ message: ">> Invalid email format" }),

    password: z
        .string()
        .min(8, { message: ">> Password required" })
        .regex(/[A-Z]/, { message: ">> Need 1 uppercase letter" })
        .regex(/[a-z]/, { message: ">> Need 1 lowercase letter" })
        .regex(/[0-9]/, { message: ">> Need 1 number" }),

    acceptTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: ">> You must accept Terms and Conditions",
        }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;