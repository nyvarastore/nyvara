'use client';

import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/shop/ProductCard';
import Button from '@/components/ui/Button';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.eyebrow}>
          <Heart size={14} fill="currentColor" /> Liste de souhaits
        </div>
        <h1 className={styles.title}>Vos favoris</h1>
        <p className={styles.subtitle}>
          Retrouvez ici toutes les lunettes que vous avez sélectionnées.
        </p>
      </header>

      {/* Content */}
      <main className={styles.content}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <Heart size={64} strokeWidth={1} />
            </div>
            <h2 className={styles.emptyTitle}>Votre liste est vide</h2>
            <p className={styles.emptyText}>
              Vous n'avez pas encore ajouté de lunettes à vos favoris. Explorez notre collection et cliquez sur le cœur pour sauvegarder vos modèles préférés.
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg">Découvrir la collection</Button>
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
