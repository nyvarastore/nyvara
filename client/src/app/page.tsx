import type { Metadata } from 'next';
import HeroSection      from '@/components/home/HeroSection';
import FrameCarousel    from '@/components/home/FrameCarousel';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStrip       from '@/components/home/BrandStrip';

export const metadata: Metadata = {
  title:       'Nyvara — Luxury Sunglasses Tunisia',
  description: 'Discover Nyvara\'s unique, customizable luxury sunglasses. The way you see the day — create your perfect style.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FrameCarousel />
      <FeaturedProducts />
      <BrandStrip />
    </>
  );
}
