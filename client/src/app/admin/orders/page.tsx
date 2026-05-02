'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import adminStyles from '../admin.module.css';
import styles from './orders.module.css';

// Auto-sync interval in milliseconds (2 minutes)
const AUTO_SYNC_INTERVAL = 2 * 60 * 1000;

// Cosmos status → French label + CSS class
const DELIVERY_STATUS: Record<string, { label: string; cls: string }> = {
  pending:             { label: 'En attente',    cls: 'pending'    },
  'to-be-picked':      { label: 'À ramasser',    cls: 'picking'    },
  'in-depot':          { label: 'Au dépôt',      cls: 'depot'      },
  'in-delivery':       { label: 'En livraison',  cls: 'delivering' },
  'to-be-verified':    { label: 'À vérifier',    cls: 'verify'     },
  'return-stock':      { label: 'Retour dépôt',  cls: 'returned'   },
  delivered:           { label: 'Livré ✓',       cls: 'delivered'  },
  'final-return':      { label: 'Retour final',  cls: 'returned'   },
  'received-return':   { label: 'Retour reçu',   cls: 'returned'   },
  'in-transfer':       { label: 'Inter-dépôt',   cls: 'transit'    },
  'return-in-transfer':{ label: 'Inter-retour',  cls: 'returned'   },
};

export default function AdminOrdersPage() {
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);
  const [syncing, setSyncing]     = useState(false);
  const [lastSync, setLastSync]   = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(AUTO_SYNC_INTERVAL / 1000);
  const ordersRef                 = useRef<Order[]>([]);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) {
      setOrders(data as Order[]);
      ordersRef.current = data as Order[];
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  /** Refresh delivery status — works with either current state or ref */
  const syncDeliveryStatus = useCallback(async (silent = false) => {
    if (!silent) setSyncing(true);

    const barcodes = ordersRef.current
      .filter(o => o.cosmos_barcode)
      .map(o => o.cosmos_barcode!)
      .join(',');

    if (!barcodes) { setSyncing(false); return; }

    try {
      const res  = await fetch(`/api/cosmos/orders?barcode=${barcodes}`);
      const data = await res.json();

      if (data.ok && Array.isArray(data.data)) {
        await Promise.all(
          (data.data as { id: string; status: string }[]).map(d =>
            supabase
              .from('orders')
              .update({ cosmos_status: d.status })
              .eq('cosmos_barcode', d.id)
          )
        );
        await fetchOrders();
        setLastSync(new Date());
        setCountdown(AUTO_SYNC_INTERVAL / 1000);
      }
    } catch (err) {
      console.error('[AutoSync] Failed:', err);
    }

    if (!silent) setSyncing(false);
  }, [fetchOrders]);

  // ── Auto-sync every 2 minutes ─────────────────────────────────────────────
  useEffect(() => {
    // Countdown ticker (updates every second)
    const ticker = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) return AUTO_SYNC_INTERVAL / 1000;
        return prev - 1;
      });
    }, 1000);

    // Actual sync interval
    const syncer = setInterval(() => {
      syncDeliveryStatus(true); // silent = no spinner on button
    }, AUTO_SYNC_INTERVAL);

    return () => {
      clearInterval(ticker);
      clearInterval(syncer);
    };
  }, [syncDeliveryStatus]);

  if (loading) return <div className={adminStyles.contentArea}>Chargement...</div>;

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Commandes</h1>
        <div className={styles.syncArea}>
          {lastSync && (
            <span className={styles.syncMeta}>
              Dernière sync : {lastSync.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              &nbsp;·&nbsp;prochaine dans <strong>{countdown}s</strong>
            </span>
          )}
          <button
            className={styles.syncBtn}
            onClick={() => syncDeliveryStatus(false)}
            disabled={syncing}
          >
            {syncing ? '⟳ Synchronisation...' : '⟳ Actualiser maintenant'}
          </button>
        </div>
      </div>

      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Téléphone</th>
              <th>Ville</th>
              <th>Date</th>
              <th>Total</th>
              <th>Livraison</th>
              <th>Étiquette</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const delivery = DELIVERY_STATUS[order.cosmos_status ?? ''];
              return (
                <tr key={order.id}>
                  <td>#{order.id.slice(0, 8)}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.phone}</td>
                  <td>{order.city}</td>
                  <td>{new Date(order.created_at || '').toLocaleDateString('fr-FR')}</td>
                  <td>{order.total_price?.toFixed(3)} TND</td>
                  <td>
                    {order.cosmos_barcode ? (
                      <span className={`${styles.deliveryBadge} ${styles[delivery?.cls ?? 'pending']}`}>
                        {delivery?.label ?? order.cosmos_status ?? 'En attente'}
                      </span>
                    ) : (
                      <span className={`${styles.deliveryBadge} ${styles.noShipment}`}>
                        Non envoyé
                      </span>
                    )}
                  </td>
                  <td>
                    {order.cosmos_label_pdf_url ? (
                      <div className={styles.labelBtns}>
                        <a
                          href={order.cosmos_label_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.labelBtn}
                          title="Imprimer étiquette PDF"
                        >
                          🖨 PDF
                        </a>
                        <a
                          href={order.cosmos_label_url ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${styles.labelBtn} ${styles.labelBtnHtml}`}
                          title="Voir étiquette HTML"
                        >
                          🌐 HTML
                        </a>
                      </div>
                    ) : (
                      <span className={styles.noLabel}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>Aucune commande pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
