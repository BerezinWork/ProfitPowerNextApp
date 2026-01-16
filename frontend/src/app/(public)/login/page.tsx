import type { Metadata } from "next";
import LoginForm from "@/features/auth/ui/LoginForm/LoginForm";

export const metadata: Metadata = {
    title: "Login",
    description: "Access your financial terminal",
};

export default function LoginPage() {
    return (
        <main>
            <LoginForm />
        </main>
    );
}