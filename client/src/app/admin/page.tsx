'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import adminStyles from './admin.module.css';
import styles from './dashboard.module.css';

// Cosmos statuses that count as "delivered"
const DELIVERED_STATUSES = ['delivered'];
// Cosmos statuses that count as "returned"
const RETURNED_STATUSES  = ['final-return', 'received-return', 'return-stock'];

// Cosmos delivery tariffs (DT)
const TARIF_LIVRE   = 8;
const TARIF_RETOUR  = 3;

interface OrderWithItems extends Order {
  order_items: {
    quantity: number;
    products: { cost_price: number | null } | null;
  }[];
}

export default function AdminDashboardPage() {
  const [orders, setOrders]   = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          products ( cost_price )
        )
      `)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data as OrderWithItems[]);
        setLoading(false);
      });
  }, []);

  // ── Basic metrics ────────────────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ordersToday  = orders.filter(o => new Date(o.created_at || '').getTime() >= today.getTime());
  const revenueToday = ordersToday.reduce((s, o) => s + (o.total_price ?? 0), 0);

  // ── Revenue Calculator ───────────────────────────────────────────────────
  const deliveredOrders = orders.filter(o => DELIVERED_STATUSES.includes(o.cosmos_status ?? ''));
  const returnedOrders  = orders.filter(o => RETURNED_STATUSES.includes(o.cosmos_status ?? ''));

  // Gross revenue from delivered orders (what customers paid)
  const grossRevenue = deliveredOrders.reduce((s, o) => s + (o.total_price ?? 0), 0);

  // Total cost of goods sold (sum of cost_price × qty for each item in delivered orders)
  const totalCOGS = deliveredOrders.reduce((sum, order) => {
    const orderCost = (order.order_items ?? []).reduce((s, item) => {
      const cost = item.products?.cost_price ?? 0;
      return s + cost * (item.quantity ?? 1);
    }, 0);
    return sum + orderCost;
  }, 0);

  // Cosmos delivery fees
  const deliveryFees = deliveredOrders.length * TARIF_LIVRE;
  const returnFees   = returnedOrders.length  * TARIF_RETOUR;
  const totalFees    = deliveryFees + returnFees;

  // Net Revenue = Gross - COGS - all Cosmos fees
  const netRevenue = grossRevenue - totalCOGS - totalFees;

  if (loading) return <div className={adminStyles.contentArea}>Chargement...</div>;

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Aperçu de la progression</h1>
      </div>

      {/* ── Top Metric Cards ── */}
      <div className={styles.dashboardGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricTitle}>Commandes d&apos;aujourd&apos;hui</div>
          <div className={styles.metricValue}>{revenueToday.toFixed(3)} TND</div>
          <div className={styles.metricSub}>{ordersToday.length} Commandes</div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricTitle}>Toutes les commandes</div>
          <div className={styles.metricValue}>{orders.length}</div>
          <div className={styles.metricSub}>Historique complet</div>
        </div>

        <div className={`${styles.metricCard} ${styles.accent}`}>
          <div className={styles.metricTitle}>Revenu Brut (Livrés)</div>
          <div className={styles.metricValue}>{grossRevenue.toFixed(3)} TND</div>
          <div className={styles.metricSub}>{deliveredOrders.length} livrés · {returnedOrders.length} retournés</div>
        </div>
      </div>

      {/* ── Revenue Calculator ── */}
      <div className={styles.calcSection}>
        <h2 className={styles.sectionTitle}>💰 Calculateur de Revenu Net</h2>

        <div className={styles.calcGrid}>

          {/* Left: Tariff info */}
          <div className={styles.tariffCard}>
            <div className={styles.tariffTitle}>Calcul des Tarifs Expéditeur</div>
            <div className={styles.tariffRow}>
              <span>Tarif par Livré</span>
              <span className={styles.tariffVal}>{TARIF_LIVRE.toFixed(2)} DT</span>
            </div>
            <div className={styles.tariffRow}>
              <span>Tarif par Retourné</span>
              <span className={styles.tariffVal}>{TARIF_RETOUR.toFixed(2)} DT</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.tariffRow}>
              <span>Commandes livrées</span>
              <span>{deliveredOrders.length}</span>
            </div>
            <div className={styles.tariffRow}>
              <span>Commandes retournées</span>
              <span>{returnedOrders.length}</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.tariffRow}>
              <span>Frais livraisons</span>
              <span className={styles.negative}>−{deliveryFees.toFixed(3)} TND</span>
            </div>
            <div className={styles.tariffRow}>
              <span>Frais retours</span>
              <span className={styles.negative}>−{returnFees.toFixed(3)} TND</span>
            </div>
            <div className={`${styles.tariffRow} ${styles.tariffTotal}`}>
              <span>Total frais Cosmos</span>
              <span className={styles.negative}>−{totalFees.toFixed(3)} TND</span>
            </div>
          </div>

          {/* Right: Breakdown */}
          <div className={styles.breakdownCard}>
            <div className={styles.tariffTitle}>Détail du Revenu Net</div>

            <div className={styles.calcRow}>
              <span>Revenu brut (ventes livrées)</span>
              <span className={styles.positive}>+{grossRevenue.toFixed(3)} TND</span>
            </div>
            <div className={styles.calcRow}>
              <span>Coût d&apos;achat produits</span>
              <span className={styles.negative}>−{totalCOGS.toFixed(3)} TND</span>
            </div>
            <div className={styles.calcRow}>
              <span>Frais Cosmos (livraisons)</span>
              <span className={styles.negative}>−{deliveryFees.toFixed(3)} TND</span>
            </div>
            <div className={styles.calcRow}>
              <span>Frais Cosmos (retours)</span>
              <span className={styles.negative}>−{returnFees.toFixed(3)} TND</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.netRow}>
              <span>Revenu Net</span>
              <span className={netRevenue >= 0 ? styles.netPositive : styles.netNegative}>
                {netRevenue >= 0 ? '+' : ''}{netRevenue.toFixed(3)} TND
              </span>
            </div>

            <div className={styles.calcHint}>
              Formule : Ventes livrées − Coût d&apos;achat − ({TARIF_LIVRE} DT × livrés) − ({TARIF_RETOUR} DT × retournés)
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
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
                <th>Statut livraison</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(order => (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.customer_name}</td>
                  <td>{new Date(order.created_at || '').toLocaleDateString('fr-FR')}</td>
                  <td>{order.total_price?.toFixed(3)} TND</td>
                  <td>
                    <span className={`${adminStyles.statusBadge} ${adminStyles.statusPending}`}>
                      {order.cosmos_status || 'En attente'}
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
