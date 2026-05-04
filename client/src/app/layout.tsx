import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import MainWrapper from '@/components/layout/MainWrapper';
import FacebookPixel from '@/components/analytics/FacebookPixel';

export const metadata: Metadata = {
  title: {
    default: 'Nyvara — Accessoires de Luxe Tunisie',
    template: '%s | Nyvara',
  },
  description:
    'Découvrez des accessoires de luxe uniques conçus pour la Tunisie. Nyvara — là où l\'élégance rencontre le style de vie méditerranéen.',
  keywords: ['accessoires de luxe', 'Tunisie', 'bijoux', 'bagues', 'lunettes de soleil', 'TND', 'Nyvara'],
  authors: [{ name: 'Nyvara' }],
  openGraph: {
    title:       'Nyvara — Accessoires de Luxe Tunisie',
    description: 'Accessoires de luxe uniques et élégants pour le marché tunisien.',
    type:        'website',
    locale:      'fr_TN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <FacebookPixel />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <MainWrapper>
              {children}
            </MainWrapper>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
