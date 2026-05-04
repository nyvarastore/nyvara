import React from 'react';
import styles from './ProductSkeleton.module.css';

export default function ProductSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonPrice} />
      </div>
    </div>
  );
}
