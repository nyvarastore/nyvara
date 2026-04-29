'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import type { CartItem as CartItemType } from '@/types';
import styles from './CartItem.module.css';

interface CartItemProps {
  item: CartItemType;
}

const formatTND = (amount: number) =>
  `${amount.toLocaleString('fr-TN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} TND`;

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className={styles.item}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title ?? 'Product'}
            fill
            className={styles.image}
            sizes="80px"
          />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true" />
        )}
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.title}>{product.title ?? 'Sunglasses'}</p>
        {product.categories?.name && (
          <p className={styles.category}>{product.categories.name}</p>
        )}
        {product.gender && (
          <p className={styles.gender}>
            {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
          </p>
        )}
        <p className={styles.price}>{formatTND((product.price ?? 0) * quantity)}</p>
      </div>

      {/* Quantity controls */}
      <div className={styles.controls}>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(product.id, quantity - 1)}
          aria-label="Decrease quantity"
        >
          <Minus size={12} />
        </button>
        <span className={styles.qty}>{quantity}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => updateQuantity(product.id, quantity + 1)}
          aria-label="Increase quantity"
        >
          <Plus size={12} />
        </button>
        <button
          className={styles.removeBtn}
          onClick={() => removeItem(product.id)}
          aria-label="Remove item"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
