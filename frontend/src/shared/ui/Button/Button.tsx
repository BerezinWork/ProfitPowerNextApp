'use client'

import { useFormStatus } from 'react-dom';
import clsx from 'clsx';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant: 'primary' | 'secondary';
}

export default function Button(
    {
        variant = 'primary',
        isLoading,
        className,
        children,
        disabled,
        ...props
    }: ButtonProps,
) {
    const { pending } = useFormStatus();
    const isButtonDisabled = pending || isLoading || disabled;

    return (
        <button
            className={clsx(
                styles.button,
                styles[variant],
                className
            )}
            disabled={ isButtonDisabled }
            {...props}
        >
            { isButtonDisabled ? 'Loading...' : children}
        </button>
    );
}