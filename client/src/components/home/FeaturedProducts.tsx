'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useFeaturedProducts } from '@/hooks/useProducts';
import styles from './FeaturedProducts.module.css';

export default function FeaturedProducts() {
  const { products, loading } = useFeaturedProducts(6);

  return (
    <section className={styles.section} id="featured">
      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Styles Prêts-à-Porter</p>
            <h2 className={styles.headline}>Choisissez l’un de nos<br />Styles Prêts-à-Porter</h2>
          </div>
          <Link href="/shop" className={styles.viewAll}>
            Voir tout <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className={styles.loadingWrap}>
            <LoadingSpinner size="lg" color="gold" />
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyWrap}>
            <p className={styles.emptyText}>Produits à venir — revenez bientôt.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
