'use client'

import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className={styles.wrapper}>
                {label && (
                    <label htmlFor={id} className={styles.label}>
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    id={id}
                    className={clsx(
                        styles.input,
                        error && styles.inputError,
                        className
                    )}
                    {...props}
                />

                {error && <span className={styles.errorMessage}>{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
export default Input;