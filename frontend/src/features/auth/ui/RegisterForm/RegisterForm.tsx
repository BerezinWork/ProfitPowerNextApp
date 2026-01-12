'use client'

import { useActionState } from "react";
import { registerUser } from "@/features/auth/actions/register";

import { AuthCard } from "@/features/auth/ui/AuthCard";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

import Link from "next/link";

import styles from "./RegisterForm.module.css";

const initialState = {
    message: null,
    errors: {}
}

export default function RegisterForm() {
    const [state, action]  = useActionState(registerUser, initialState);

    return (
        <AuthCard type="register">
            <form action={action} className={styles.formContent}>
                {state.message && (
                    <div className={styles.alertError}>
                        {state.message}
                    </div>
                )}

                <Input
                    name="nickname"
                    placeholder="ENTER A NICKNAME"
                    error={state.errors?.nickname?.[0]}
                    label="Nickname"
                />
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
                <div className={styles.checkboxGroup}>
                    <input
                        type="checkbox"
                        name="acceptTerms"
                        id="terms"
                        className={styles.checkbox}
                    />
                    <label htmlFor="terms" className={styles.checkboxLabel}>
                        I accept the <Link href="/terms" className={styles.link}>Protocol Terms & Data Policy</Link>
                    </label>
                    <div>
                        {state.errors?.acceptTerms?.[0] && (
                            <div className={styles.checkboxError}>
                                {state.errors.acceptTerms[0]}
                            </div>
                        )}
                    </div>
                </div>
                <Button type="submit" variant="primary">
                    CREATE IDENTITY -&gt;
                </Button>
            </form>
        </AuthCard>
    );
}