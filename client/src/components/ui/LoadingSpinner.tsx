'use client';

import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'black' | 'gold' | 'white';
  label?: string;
}

export default function LoadingSpinner({ size = 'md', color = 'black', label = 'Loading…' }: LoadingSpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-label={label}>
      <span className={`${styles.spinner} ${styles[size]} ${styles[color]}`} />
      <span className={styles.srOnly}>{label}</span>
    </div>
  );
}
