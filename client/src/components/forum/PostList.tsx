'use client';

import PostCard from './PostCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import type { ForumPost } from '@/types';
import styles from './PostList.module.css';

interface PostListProps {
  posts: ForumPost[];
  loading?: boolean;
  error?: string | null;
}

export default function PostList({ posts, loading = false, error = null }: PostListProps) {
  if (loading) {
    return (
      <div className={styles.centered}>
        <LoadingSpinner size="lg" color="gold" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Aucune discussion</p>
        <p className={styles.emptyText}>Soyez le premier à lancer une conversation !</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
