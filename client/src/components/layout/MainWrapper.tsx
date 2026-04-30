'use client';

import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <main style={{ paddingTop: isAdmin ? '0' : 'var(--nav-height)', flex: 1, display: 'flex', flexDirection: 'column' }}>
      {children}
    </main>
  );
}
