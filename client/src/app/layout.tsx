import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export const metadata: Metadata = {
  title: {
    default: 'Nyvara — Lunettes de Soleil de Luxe Tunisie',
    template: '%s | Nyvara',
  },
  description:
    'Découvrez des lunettes de soleil de luxe uniques et personnalisables conçues pour la Tunisie. Nyvara — là où le style rencontre le soleil méditerranéen.',
  keywords: ['lunettes de soleil', 'Tunisie', 'lunettes', 'TND', 'lunetterie de luxe', 'Nyvara'],
  authors: [{ name: 'Nyvara' }],
  openGraph: {
    title:       'Nyvara — Lunettes de Soleil de Luxe Tunisie',
    description: 'Lunettes de soleil de luxe uniques et personnalisables pour le marché tunisien.',
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
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <main style={{ paddingTop: 'var(--nav-height)' }}>
              {children}
            </main>
            <Footer />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
