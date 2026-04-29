'use client';

import { useCart } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import styles from './OrderSummary.module.css';

const formatTND = (amount: number) =>
  `${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} TND`;

interface OrderSummaryProps {
  onCheckoutTap?: () => void;
  showCheckoutBtn?: boolean;
}

export default function OrderSummary({ onCheckoutTap, showCheckoutBtn = true }: OrderSummaryProps) {
  const { items, total } = useCart();

  return (
    <div className={styles.summary}>
      <div className={styles.row}>
        <span className={styles.label}>Sous-total</span>
        <span>{formatTND(total)}</span>
      </div>
      <div className={styles.row}>
        <span className={styles.label}>Livraison</span>
        <span className={styles.free}>Gratuit</span>
      </div>
      <div className={`${styles.row} ${styles.totalRow}`}>
        <span>Total</span>
        <span className={styles.totalAmount}>{formatTND(total)}</span>
      </div>
      
      {showCheckoutBtn && (
        <Button
          variant="gold"
          fullWidth
          size="lg"
          disabled={items.length === 0}
          onClick={onCheckoutTap}
        >
          Passer à la livraison
        </Button>
      )}
      
      <p className={styles.hint}>Prix en Dinar Tunisien (TND)</p>
    </div>
  );
}
