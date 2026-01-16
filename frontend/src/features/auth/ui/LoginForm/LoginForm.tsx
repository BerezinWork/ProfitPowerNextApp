'use client'

import { useActionState } from "react";
import { loginUser } from "@/features/auth/actions/login";

import { AuthCard } from "@/features/auth/ui/AuthCard";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

import styles from "./LoginForm.module.css";

const initialState = {
    errors: {},
    message: null
}

export default function LoginForm() {
    const [state, action] = useActionState(loginUser, initialState);

    return (
        <AuthCard type="login">
            <form action={action} className={styles.formContent}>
                {state.message && (
                    <div className={styles.alertError}>
                        {state.message}
                    </div>
                )}

                <Input
                    name="email"
                    type="email"
                    placeholder="USER@PROFIT.COM"
                    error={state.errors?.email?.[0]}
                    label="Email"
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="************"
                    error={state.errors?.password?.[0]}
                    label="Password"
                />
                <Button type="submit" variant="primary">
                    INITIALIZE SESSION -&gt;
                </Button>
            </form>
        </AuthCard>
    );
}