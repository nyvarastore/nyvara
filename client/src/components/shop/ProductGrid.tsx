'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import styles from './ProductGrid.module.css';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

const formatTND = (price: number | null) => {
  if (price === null) return '—';
  return `${price.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND`;
};

export default function ProductGrid({ products, loading = false, error = null }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { addItem, isInCart } = useCart();

  if (loading) {
    return (
      <div className={styles.grid}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrap}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <p className={styles.emptyTitle}>No products found</p>
        <p className={styles.emptyText}>Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        size="lg"
      >
        {quickViewProduct && (
          <div className={styles.quickView}>
            <div className={styles.qvImage}>
              {quickViewProduct.image_url ? (
                <Image
                  src={quickViewProduct.image_url}
                  alt={quickViewProduct.title ?? 'Product'}
                  fill
                  className={styles.qvImg}
                  sizes="400px"
                />
              ) : (
                <div className={styles.qvPlaceholder}>
                  <span>NYVARA</span>
                </div>
              )}
            </div>
            <div className={styles.qvInfo}>
              {quickViewProduct.categories?.name && (
                <p className={styles.qvCategory}>{quickViewProduct.categories.name}</p>
              )}
              <h2 className={styles.qvTitle}>{quickViewProduct.title}</h2>
              {quickViewProduct.description && (
                <p className={styles.qvDescription}>{quickViewProduct.description}</p>
              )}
              <p className={styles.qvPrice}>{formatTND(quickViewProduct.price)}</p>
              {quickViewProduct.gender && (
                <p className={styles.qvGender}>
                  Collection: <strong>{quickViewProduct.gender === 'homme' ? "Men's" : quickViewProduct.gender === 'femme' ? "Women's" : 'Unisex'}</strong>
                </p>
              )}
              <Button
                variant={isInCart(quickViewProduct.id) ? 'gold' : 'primary'}
                fullWidth
                size="lg"
                onClick={() => { addItem(quickViewProduct); setQuickViewProduct(null); }}
              >
                {isInCart(quickViewProduct.id) ? 'Added to Cart ✓' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
