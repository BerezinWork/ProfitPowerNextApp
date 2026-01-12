import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import styles from "./AuthCard.module.css";
import { APP_VERSION } from "@/shared/config/constant";

interface AuthCardProps {
    children: React.ReactNode;
    type: 'login' | 'register';
}

export default function AuthCard(
    {
        children,
        type,
    }: AuthCardProps
) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Image
                    className={styles.logo}
                    src='/main-logo.svg'
                    alt='Profit Power Logo'
                    width={200}
                    height={40}
                    priority
                />
                <div className={styles.version}>
                    <span>Secure Financial Terminal</span> {APP_VERSION}
                </div>
            </header>
            <div className={styles.card}>
                <div className={styles.tabs}>
                    <Link
                        href="/login"
                        className={clsx(
                            styles.tab,
                            type === 'login' && styles.tabActive
                        )}
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className={clsx(
                            styles.tab,
                            type === 'register' && styles.tabActive
                        )}
                    >
                        Register
                    </Link>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <footer className={styles.footer}>
                &gt; System Status: <span>Online</span>
            </footer>
        </div>
    );
}