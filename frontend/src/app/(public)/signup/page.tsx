import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export const metadata: Metadata = {
    title: "SignUp",
    description: "Create your secure financial identity",
};

export default function SignupPage() {
    return (
        <main>
            <RegisterForm />
        </main>
    );
}