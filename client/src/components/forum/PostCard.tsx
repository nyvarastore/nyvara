'use client';

import { MessageCircle, Clock, User } from 'lucide-react';
import type { ForumPost } from '@/types';
import styles from './PostCard.module.css';

interface PostCardProps {
  post: ForumPost;
  onClick?: (post: ForumPost) => void;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      className={styles.card}
      onClick={() => onClick?.(post)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => { if (onClick && e.key === 'Enter') onClick(post); }}
    >
      <div className={styles.body}>
        <div className={styles.tags}>
          {post.tags?.map(tag => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>
          {post.content.length > 160 ? post.content.slice(0, 160) + '…' : post.content}
        </p>
      </div>
      <div className={styles.footer}>
        <span className={styles.meta}>
          <User size={13} />
          {post.author}
        </span>
        <span className={styles.meta}>
          <Clock size={13} />
          {timeAgo(post.created_at)}
        </span>
        <span className={`${styles.meta} ${styles.replies}`}>
          <MessageCircle size={13} />
          Répondre
        </span>
      </div>
    </article>
  );
}
