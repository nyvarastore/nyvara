'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Order } from '@/types';
import adminStyles from '../admin.module.css';

export default function AdminOrdersPage() {
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

  if (loading) return <div className={adminStyles.contentArea}>Chargement...</div>;

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Commandes</h1>
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
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>#{order.id.slice(0,8)}</td>
                <td>{order.nom} {order.prenom}</td>
                <td>{order.telephone}</td>
                <td>{order.ville}</td>
                <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                <td>{order.total?.toFixed(3)} TND</td>
                <td>
                  <span className={`${adminStyles.statusBadge} ${adminStyles.statusPending}`}>
                    {order.status || 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Aucune commande pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
