'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, LogOut } from 'lucide-react';
import { logoutAction } from './actions';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>NYVARA Admin</div>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navItem} data-active={pathname === '/admin'}>
            <LayoutDashboard size={20} />
            <span>Tableau de bord</span>
          </Link>
          <Link href="/admin/orders" className={styles.navItem} data-active={pathname === '/admin/orders'}>
            <ShoppingCart size={20} />
            <span>Commandes</span>
          </Link>
          <Link href="/admin/products" className={styles.navItem} data-active={pathname === '/admin/products'}>
            <Package size={20} />
            <span>Produits</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <form action={logoutAction}>
            <button type="submit" className={styles.logoutBtn}>
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Top Header */}
        <header className={styles.topHeader}>
          <div className={styles.headerTitle}>
            Bienvenue dans l'espace d'administration
          </div>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>A</div>
            <span>Admin</span>
          </div>
        </header>

        <main className={styles.contentArea}>
          {children}
        </main>
      </div>
    </div>
  );
}
