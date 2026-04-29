'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, TrendingUp, Search } from 'lucide-react';
import PostList    from '@/components/forum/PostList';
import NewPostForm from '@/components/forum/NewPostForm';
import type { ForumPost } from '@/types';
import styles from './forum.module.css';

// Sample posts — these will be replaced when a forum_posts table is added to Supabase
const SAMPLE_POSTS: ForumPost[] = [
  {
    id:         '1',
    title:      'Meilleures lunettes pour conduire en Tunisie ?',
    content:    "Je fais la navette tous les jours de Tunis à Sfax et le soleil de l’après-midi est brutal. Je cherche des options polarisées qui réduisent les reflets sans être trop sombres pour les yeux…",
    author:     'Rami Belhaj',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    tags:       ['polarisé', 'conduite'],
  },
  {
    id:         '2',
    title:      'Les montures œil-de-chat sont-elles toujours à la mode en 2024 ?',
    content:    "J’ai vu beaucoup de montures œil-de-chat au festival le week-end dernier et je me demande si cette tendance est là pour durer ou si c’est juste saisonnier…",
    author:     'Sana Trabelsi',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    tags:       ['oeil-de-chat', 'tendances', 'femme'],
  },
  {
    id:         '3',
    title:      'Comment nettoyer des montures en acétate sans les rayer ?',
    content:    "J’ai une paire de montures en acétate écaille de tortue et j’ai peur de les rayer. Des conseils pour les nettoyer et les entretenir sur le long terme ?",
    author:     'Majed Sfaxi',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    tags:       ['entretien', 'acétate'],
  },
  {
    id:         '4',
    title:      'Aviateur vs Wayfarer — lequel est le plus polyvalent ?',
    content:    "Je n’arrive jamais à choisir entre les deux. Les aviateurs paraissent plus classiques mais les wayfarers semblent convenir à plus de formes de visage. Qu’en pensez-vous ?",
    author:     'Ines Bouaziz',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags:       ['aviateur', 'wayfarer', 'style'],
  },
];

export default function ForumPage() {
  const [posts, setPosts]         = useState<ForumPost[]>(SAMPLE_POSTS);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]       = useState('');

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.content.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.includes(search.toLowerCase()))
  );

  const handleNewPost = useCallback(async (post: Omit<ForumPost, 'id' | 'created_at'>) => {
    setSubmitting(true);
    // Optimistic insert — replace with Supabase call once forum_posts table is added
    await new Promise(r => setTimeout(r, 600));
    const newPost: ForumPost = {
      ...post,
      id:         Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
    setSubmitting(false);
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Communauté</p>
          <h1 className={styles.heroTitle}>Forum Style</h1>
          <p className={styles.heroSub}>
            Discutez de styles, partagez des conseils et rejoignez les passionnés de lunettes Nyvara à travers la Tunisie.
          </p>

          {/* Search */}
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Rechercher des discussions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Rechercher dans le forum"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.inner}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarCard}>
              <div className={styles.statRow}>
                <MessageSquare size={18} className={styles.statIcon} />
                <div>
                  <p className={styles.statNum}>{posts.length}</p>
                  <p className={styles.statLabel}>Discussions</p>
                </div>
              </div>
              <div className={styles.statRow}>
                <TrendingUp size={18} className={styles.statIcon} />
                <div>
                  <p className={styles.statNum}>Actif</p>
                  <p className={styles.statLabel}>Communauté</p>
                </div>
              </div>
            </div>

            {/* Popular tags */}
            <div className={styles.tagsCard}>
              <h3 className={styles.tagsTitle}>Tags populaires</h3>
              <div className={styles.tagCloud}>
                {['polarisé', 'aviateur', 'wayfarer', 'oeil-de-chat', 'style', 'conduite', 'entretien', 'tendances'].map(t => (
                  <button
                    key={t}
                    className={`${styles.tagPill} ${search === t ? styles.tagPillActive : ''}`}
                    onClick={() => setSearch(s => s === t ? '' : t)}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className={styles.main}>
            {/* New Post */}
            <NewPostForm onSubmit={handleNewPost} loading={submitting} />

            {/* Posts */}
            <div className={styles.postsSection}>
              <div className={styles.postsHeader}>
                <h2 className={styles.postsTitle}>
                  {search ? `Résultats pour « ${search} »` : 'Toutes les discussions'}
                </h2>
                <span className={styles.postsMeta}>
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'discussion' : 'discussions'}
                </span>
              </div>
              <PostList posts={filteredPosts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
