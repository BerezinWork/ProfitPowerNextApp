import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export const metadata: Metadata = {
    title: "Join Profit Power",
    description: "Create your secure financial identity",
};

export default function SignupPage() {
    return (
        <main>
            <RegisterForm />
        </main>
    );
}