'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import styles from './track.module.css';

export default function GenericTrackPage() {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(true);

  // Auto-redirect if they have a recent order in localStorage
  useEffect(() => {
    const lastOrder = localStorage.getItem('nyvara_last_order');
    if (lastOrder) {
      router.replace(`/track/${lastOrder}`);
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    router.push(`/track/${trackingId.trim()}`);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.inner} style={{ textAlign: 'center' }}>
          Vérification de vos commandes récentes...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>Suivre ma commande</h1>
        <p className={styles.desc}>
          Veuillez entrer votre numéro de commande pour vérifier son statut d'expédition.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <Search className={styles.icon} size={20} />
            <input
              type="text"
              placeholder="Ex: d8c42a20..."
              className={styles.input}
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              required
            />
          </div>
          <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '16px' }}>
            Rechercher
          </Button>
        </form>
      </div>
    </div>
  );
}
