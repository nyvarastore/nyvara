'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ImageUpload from '@/components/admin/ImageUpload';
import adminStyles from '../admin.module.css';
import styles from './products.module.css';

type FormState = {
  title: string;
  price: string;
  cost_price: string;
  stock: string;
  description: string;
  image_url: string;
  gender: string;
  category_id: string;
};

const emptyForm: FormState = {
  title: '', price: '', cost_price: '', stock: '0', description: '',
  image_url: '', gender: 'unisex', category_id: '',
};

export default function AdminProductsPage() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // null = add mode
  const [formData, setFormData]   = useState<FormState>(emptyForm);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      supabase.from('products').select('*, categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]).then(([{ data: prods }, { data: cats }]) => {
      if (prods) setProducts(prods as Product[]);
      if (cats)  setCategories(cats as Category[]);
      setLoading(false);
    });
  };

  useEffect(() => { fetchAll(); }, []);

  // Open modal in ADD mode
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  // Open modal in EDIT mode pre-filled
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      title:       p.title       ?? '',
      price:       p.price       != null ? String(p.price)       : '',
      cost_price:  p.cost_price  != null ? String(p.cost_price)  : '',
      stock:       p.stock       != null ? String(p.stock)       : '0',
      description: p.description ?? '',
      image_url:   p.image_url   ?? '',
      gender:      p.gender      ?? 'unisex',
      category_id: p.category_id ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title:       formData.title,
      price:       parseFloat(formData.price) || 0,
      cost_price:  formData.cost_price ? parseFloat(formData.cost_price) : null,
      stock:       parseInt(formData.stock, 10) || 0,
      description: formData.description,
      image_url:   formData.image_url,
      gender:      formData.gender,
      category_id: formData.category_id || null,
    };

    const { error } = editingProduct
      ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
      : await supabase.from('products').insert([payload]);

    setSubmitting(false);

    if (!error) {
      setModalOpen(false);
      setFormData(emptyForm);
      setEditingProduct(null);
      fetchAll();
    } else {
      alert('Erreur: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce produit ?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchAll();
  };

  const margin = (p: Product) => {
    if (p.price == null || p.cost_price == null) return null;
    return p.price - p.cost_price;
  };

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [field]: e.target.value }));

  if (loading) return <div className={adminStyles.contentArea}>Chargement...</div>;

  return (
    <div>
      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Produits</h1>
        <Button variant="primary" onClick={openAddModal}>+ Ajouter un produit</Button>
      </div>

      <div className={adminStyles.tableContainer}>
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Prix vente</th>
              <th>Prix achat</th>
              <th>Marge</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const m = margin(p);
              return (
                <tr key={p.id}>
                  <td>
                    <img src={p.image_url || ''} alt={p.title || ''} className={styles.productImage} />
                  </td>
                  <td>{p.title}</td>
                  <td>{p.categories?.name ?? <span className={styles.noCost}>—</span>}</td>
                  <td>
                    {p.stock != null && p.stock > 0 
                      ? <span style={{ color: 'var(--color-charcoal)' }}>{p.stock}</span>
                      : <span style={{ color: 'var(--color-error)' }}>Rupture</span>}
                  </td>
                  <td>{p.price?.toFixed(3)} TND</td>
                  <td>
                    {p.cost_price != null
                      ? <span className={styles.costPrice}>{p.cost_price.toFixed(3)} TND</span>
                      : <span className={styles.noCost}>—</span>}
                  </td>
                  <td>
                    {m != null
                      ? <span className={m >= 0 ? styles.marginPos : styles.marginNeg}>{m.toFixed(3)} TND</span>
                      : <span className={styles.noCost}>—</span>}
                  </td>
                  <td>{p.gender}</td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.actionBtn} onClick={() => openEditModal(p)}>✏️ Éditer</button>
                      <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => handleDelete(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr><td colSpan={9} style={{ textAlign: 'center' }}>Aucun produit.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProduct(null); }}
        title={editingProduct ? `Éditer — ${editingProduct.title}` : 'Ajouter un produit'}
      >
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Nom du produit</label>
            <input required type="text" className={styles.input} value={formData.title} onChange={set('title')} />
          </div>

          <div className={styles.priceRow}>
            <div className={styles.inputGroup}>
              <label>Prix de vente (TND)</label>
              <input required type="number" step="0.001" className={styles.input} value={formData.price} onChange={set('price')} />
            </div>
            <div className={styles.inputGroup}>
              <label>Prix d&apos;achat / coût (TND)</label>
              <input type="number" step="0.001" className={styles.input} placeholder="0.000" value={formData.cost_price} onChange={set('cost_price')} />
            </div>
            <div className={styles.inputGroup}>
              <label>Stock</label>
              <input type="number" step="1" className={styles.input} value={formData.stock} onChange={set('stock')} />
            </div>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.inputGroup}>
              <label>Genre</label>
              <select className={styles.input} value={formData.gender} onChange={set('gender')}>
                <option value="unisex">Unisexe</option>
                <option value="homme">Homme</option>
                <option value="femme">Femme</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Catégorie</label>
              <select className={styles.input} value={formData.category_id} onChange={set('category_id')}>
                <option value="">— Sans catégorie —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label>Image du produit</label>
            <ImageUpload 
              value={formData.image_url} 
              onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
              onUploading={(status) => setUploadingImage(status)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea className={styles.input} rows={3} value={formData.description} onChange={set('description')} />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '8px' }} disabled={submitting || uploadingImage}>
            {submitting ? 'Enregistrement...' : uploadingImage ? 'Téléchargement de l\'image...' : editingProduct ? '💾 Enregistrer les modifications' : 'Ajouter le produit'}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
