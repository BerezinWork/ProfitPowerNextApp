import { z } from "zod";

export const registerSchema = z.object({
    nickname: z
        .string()
        .min(3, { message: "Min 3 chars" })
        .max(20, { message: "Max 20 chars" })
        .regex(/^[a-zA-Z]/, { message: "Must start with a letter" })
        .regex(/^[a-zA-Z0-9_-]+$/, { message: "Only letters, numbers, '-' and '_'" }),

    email: z
        .string()
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email format" }),

    password: z
        .string()
        .min(8, { message: "Min 8 chars" })
        .regex(/[A-Z]/, { message: "Need 1 uppercase letter" })
        .regex(/[a-z]/, { message: "Need 1 lowercase letter" })
        .regex(/[0-9]/, { message: "Need 1 number" }),

    acceptTerms: z
        .boolean()
        .refine((val) => val === true, {
            message: "You must accept Terms and Conditions",
        }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;