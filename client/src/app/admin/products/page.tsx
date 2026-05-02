'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import adminStyles from '../admin.module.css';
import styles from './products.module.css';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const [formData, setFormData] = useState({
    title:      '',
    price:      '',
    cost_price: '',
    description:'',
    image_url:  '',
    gender:     'unisex',
  });

  const fetchProducts = () => {
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setProducts(data as Product[]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from('products').insert([{
      title:       formData.title,
      price:       parseFloat(formData.price),
      cost_price:  formData.cost_price ? parseFloat(formData.cost_price) : null,
      description: formData.description,
      image_url:   formData.image_url,
      gender:      formData.gender,
    }]);

    setSubmitting(false);

    if (!error) {
      setIsModalOpen(false);
      setFormData({ title: '', price: '', cost_price: '', description: '', image_url: '', gender: 'unisex' });
      fetchProducts();
    } else {
      alert("Erreur lors de l'ajout: " + error.message);
    }
  };

  const margin = (p: Product) => {
    if (p.price == null || p.cost_price == null) return null;
    return p.price - p.cost_price;
  };

  if (loading) return <div className={adminStyles.contentArea}>Chargement...</div>;

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Produits</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Ajouter un produit
        </Button>
      </div>

      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Prix vente</th>
              <th>Prix achat</th>
              <th>Marge</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const m = margin(product);
              return (
                <tr key={product.id}>
                  <td>
                    <img src={product.image_url || ''} alt={product.title || 'Produit'} className={styles.productImage} />
                  </td>
                  <td>{product.title}</td>
                  <td>{product.price?.toFixed(3)} TND</td>
                  <td>
                    {product.cost_price != null
                      ? <span className={styles.costPrice}>{product.cost_price.toFixed(3)} TND</span>
                      : <span className={styles.noCost}>—</span>}
                  </td>
                  <td>
                    {m != null
                      ? <span className={m >= 0 ? styles.marginPos : styles.marginNeg}>{m.toFixed(3)} TND</span>
                      : <span className={styles.noCost}>—</span>}
                  </td>
                  <td>{product.gender}</td>
                  <td>
                    <button className={styles.actionBtn}>Éditer</button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Aucun produit pour le moment.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter un produit">
        <form onSubmit={handleAddProduct} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Nom du produit</label>
            <input required type="text" className={styles.input}
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className={styles.priceRow}>
            <div className={styles.inputGroup}>
              <label>Prix de vente (TND)</label>
              <input required type="number" step="0.001" className={styles.input}
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>Prix d&apos;achat / coût (TND)</label>
              <input type="number" step="0.001" className={styles.input}
                placeholder="0.000"
                value={formData.cost_price}
                onChange={e => setFormData({...formData, cost_price: e.target.value})} />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>URL de l&apos;image (Supabase Storage)</label>
            <input required type="url" className={styles.input}
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})} />
          </div>

          <div className={styles.inputGroup}>
            <label>Genre</label>
            <select className={styles.input}
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="unisex">Unisexe</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea className={styles.input} rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '16px' }}>
            {submitting ? 'Ajout en cours...' : 'Ajouter le produit'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
