'use client';

import { useState } from 'react';
import { PenLine, Tag, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import type { ForumPost } from '@/types';
import styles from './NewPostForm.module.css';

interface NewPostFormProps {
  onSubmit: (post: Omit<ForumPost, 'id' | 'created_at'>) => Promise<void>;
  loading?: boolean;
}

export default function NewPostForm({ onSubmit, loading = false }: NewPostFormProps) {
  const [title,   setTitle]   = useState('');
  const [content, setContent] = useState('');
  const [author,  setAuthor]  = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags,    setTags]    = useState<string[]>([]);
  const [error,   setError]   = useState('');

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    await onSubmit({ title: title.trim(), content: content.trim(), author: author.trim(), tags });
    setTitle(''); setContent(''); setAuthor(''); setTags([]);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <PenLine size={18} className={styles.formIcon} />
        <h3 className={styles.formTitle}>Démarrer une discussion</h3>
      </div>

      <div className={styles.fields}>
        {/* Name */}
        <div className={styles.field}>
          <label htmlFor="post-author" className={styles.label}>Votre prénom</label>
          <input
            id="post-author"
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Mohamed…"
            className={styles.input}
          />
        </div>

        {/* Title */}
        <div className={styles.field}>
          <label htmlFor="post-title" className={styles.label}>Titre</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="De quoi voulez-vous discuter ?"
            className={styles.input}
          />
        </div>

        {/* Content */}
        <div className={styles.field}>
          <label htmlFor="post-content" className={styles.label}>Message</label>
          <textarea
            id="post-content"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Partagez vos idées, questions ou conseils style…"
            rows={5}
            className={`${styles.input} ${styles.textarea}`}
          />
        </div>

        {/* Tags */}
        <div className={styles.field}>
          <label htmlFor="post-tags" className={styles.label}>Tags (optionnel, max 5)</label>
          <div className={styles.tagRow}>
            <div className={styles.tagInputWrap}>
              <Tag size={13} className={styles.tagIcon} />
              <input
                id="post-tags"
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                placeholder="style, conseils, avis…"
                className={styles.tagInput}
              />
            </div>
            <button type="button" onClick={addTag} className={styles.addTagBtn}>Ajouter</button>
          </div>
          {tags.length > 0 && (
            <div className={styles.tagChips}>
              {tags.map(t => (
                <span key={t} className={styles.chip}>
                  #{t}
                  <button type="button" onClick={() => removeTag(t)} aria-label={`Supprimer le tag ${t}`}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          loading={loading}
          disabled={!title.trim() || !content.trim() || !author.trim()}
        >
          Publier la discussion
        </Button>
      </div>
    </form>
  );
}
