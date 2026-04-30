'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import adminStyles from './admin.module.css';
import styles from './dashboard.module.css';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as Order[]);
        setLoading(false);
      });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_price ?? 0), 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter(o => new Date(o.created_at || '').getTime() >= today.getTime());
  const revenueToday = ordersToday.reduce((sum, o) => sum + (o.total_price ?? 0), 0);

  if (loading) return <div className={adminStyles.contentArea}>Chargement...</div>;

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Aperçu de la progression</h1>
      </div>

      <div className={styles.dashboardGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTitle}>Commandes d'aujourd'hui</div>
          <div className={styles.metricValue}>{revenueToday.toFixed(3)} TND</div>
          <div className={styles.metricSub}>{ordersToday.length} Commandes</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTitle}>Toutes les commandes</div>
          <div className={styles.metricValue}>{orders.length}</div>
          <div className={styles.metricSub}>Historique complet</div>
        </div>

        <div className={`${styles.metricCard} ${styles.accent}`}>
          <div className={styles.metricTitle}>Revenu Total</div>
          <div className={styles.metricValue}>{totalRevenue.toFixed(3)} TND</div>
          <div className={styles.metricSub}>{orders.length} Commandes</div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2 className={styles.sectionTitle}>Dernières Commandes</h2>
        <div className={adminStyles.tableContainer}>
          <table className={adminStyles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0,8)}</td>
                  <td>{order.customer_name}</td>
                  <td>{new Date(order.created_at || '').toLocaleDateString('fr-FR')}</td>
                  <td>{order.total_price?.toFixed(3)} TND</td>
                  <td>
                    <span className={`${adminStyles.statusBadge} ${adminStyles.statusPending}`}>
                      {order.status || 'En attente'}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>Aucune commande pour le moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
