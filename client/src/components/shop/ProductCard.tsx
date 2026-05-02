'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Badge from '@/components/ui/Badge';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';
import { fbEvent } from '@/components/analytics/FacebookPixel';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const formatTND = (price: number | null) => {
  if (price === null) return '—';
  return `${price.toLocaleString('fr-TN', { minimumFractionDigits: 3 })} TND`;
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isWishlisted } = useWishlist();
  const viewFired = useRef(false);
  const cardRef   = useRef<HTMLElement>(null);

  const inCart     = isInCart(product.id);
  const wishlisted = isWishlisted(product.id);

  // Fire ViewContent once when card enters viewport (retargeting signal)
  useEffect(() => {
    if (!cardRef.current || viewFired.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !viewFired.current) {
          viewFired.current = true;
          fbEvent.viewContent({
            content_ids:  [String(product.id)],
            content_name: product.title ?? 'Sunglasses',
            value:        product.price ?? 0,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [product]);

  const handleAddToCart = () => {
    addItem(product);
    fbEvent.addToCart({
      content_ids:  [String(product.id)],
      content_name: product.title ?? 'Sunglasses',
      value:        product.price ?? 0,
    });
  };

  const handleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      fbEvent.addToWishlist({
        content_ids:  [String(product.id)],
        content_name: product.title ?? 'Sunglasses',
      });
    }
  };

  const genderLabel: Record<string, string> = {
    homme: "Men's",
    femme: "Women's",
    unisex: 'Unisex',
  };

  return (
    <article ref={cardRef} className={styles.card} aria-label={product.title ?? 'Product'}>
      {/* Image */}
      <div className={styles.imageWrap}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.title ?? 'Sunglasses'}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <span className={styles.placeholderText}>NYVARA</span>
          </div>
        )}

        {/* Hover overlay actions */}
        <div className={styles.overlay}>
          <button
            className={styles.overlayBtn}
            onClick={() => onQuickView?.(product)}
            aria-label="Quick view"
            title="Quick view"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Gender badge */}
        {product.gender && (
          <div className={styles.genderBadge}>
            <Badge variant="black">
              {genderLabel[product.gender] ?? product.gender}
            </Badge>
          </div>
        )}

        {/* Wishlist btn */}
        <button
          className={`${styles.wishlistBtn} ${wishlisted ? styles.wishlisted : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.meta}>
          {product.categories?.name && (
            <span className={styles.category}>{product.categories.name}</span>
          )}
        </div>

        <h3 className={styles.title}>{product.title ?? 'Sunglasses'}</h3>

        <div className={styles.footer}>
          <p className={styles.price}>{formatTND(product.price)}</p>
          <button
            className={`${styles.addBtn} ${inCart ? styles.inCart : ''}`}
            onClick={handleAddToCart}
            aria-label={inCart ? 'Added to cart' : 'Add to cart'}
          >
            <ShoppingBag size={14} />
            <span>{inCart ? 'Added' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
