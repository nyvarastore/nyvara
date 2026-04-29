'use client';

import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Background gradient blocks inspired by reference image */}
      <div className={styles.bgLeft}  aria-hidden="true" />
      <div className={styles.bgRight} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Left column — texte éditorial */}
        <div className={styles.textCol}>
          <p className={styles.eyebrow}>Nouvelle Collection 2024</p>
          <h1 className={styles.headline}>
            <span className={styles.headlineThin}>PERSONNALISE</span>
          </h1>
          <p className={styles.subline}>
            La façon dont vous voyez le jour.<br />
            Créez des lunettes au style unique.
          </p>
          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryCta}>
              Acheter
            </Link>
            <Link href="/shop" className={styles.secondaryCta}>
              Explorer la Collection
            </Link>
          </div>
        </div>

        {/* Right column — hero visual */}
        <div className={styles.visual}>
          <div className={styles.heroImage}>
            {/* Decorative sunglasses silhouette SVG */}
            <svg
              className={styles.glassesSvg}
              viewBox="0 0 320 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M10 60 Q10 20 55 20 Q100 20 100 60 Q100 100 55 100 Q10 100 10 60Z"
                fill="none" stroke="#0A0A0A" strokeWidth="5"
              />
              <path
                d="M220 60 Q220 20 265 20 Q310 20 310 60 Q310 100 265 100 Q220 100 220 60Z"
                fill="none" stroke="#0A0A0A" strokeWidth="5"
              />
              <line x1="100" y1="60" x2="220" y2="60" stroke="#0A0A0A" strokeWidth="5" strokeLinecap="round" />
              <line x1="10"  y1="55" x2="0"   y2="40" stroke="#0A0A0A" strokeWidth="5" strokeLinecap="round" />
              <line x1="310" y1="55" x2="320" y2="40" stroke="#0A0A0A" strokeWidth="5" strokeLinecap="round" />
              {/* Lens tint */}
              <path
                d="M15 60 Q15 25 55 25 Q95 25 95 60 Q95 95 55 95 Q15 95 15 60Z"
                fill="#0A0A0A" opacity="0.08"
              />
              <path
                d="M225 60 Q225 25 265 25 Q305 25 305 60 Q305 95 265 95 Q225 95 225 60Z"
                fill="#0A0A0A" opacity="0.08"
              />
            </svg>

            <div className={styles.heroAccent} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#featured" className={styles.scrollIndicator} aria-label="Défiler vers le bas">
        <span className={styles.scrollText}>Défiler pour les styles</span>
        <ArrowDown size={16} className={styles.scrollArrow} />
      </a>
    </section>
  );
}
