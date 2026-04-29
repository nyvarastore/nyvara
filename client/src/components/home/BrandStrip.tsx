import styles from './BrandStrip.module.css';

const FEATURES = [
  {
    id: 'uv',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 16 Q10 10 16 10 Q22 10 22 16 Q22 22 16 22 Q10 22 10 16Z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.2"/>
      </svg>
    ),
    title: 'Protection UV400',
    desc: 'Bloque 100% des rayons UVA et UVB',
  },
  {
    id: 'frame',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="10" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="18" y="10" width="10" height="12" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="14" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="4"  y1="14" x2="1"  y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="28" y1="14" x2="31" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Montures Premium',
    desc: 'Acétate durable & métaux légers',
  },
  {
    id: 'lens',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M5 16 Q5 7 16 7 Q27 7 27 16 Q27 25 16 25 Q5 25 5 16Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <path d="M8 16 Q8 10 16 10 Q24 10 24 16" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Verres Polarisés',
    desc: 'Élimine les reflets pour une clarté cristalline',
  },
  {
    id: 'delivery',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="2" y="10" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22 14 L28 14 L30 20 L30 24 L22 24Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="8"  cy="26" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="26" cy="26" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: 'Livraison Gratuite',
    desc: 'Livraison rapide partout en Tunisie',
  },
];

export default function BrandStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>Pourquoi Nyvara</p>
          <h2 className={styles.headline}>Tout peut être personnalisé</h2>
        </div>
        <div className={styles.grid}>
          {FEATURES.map(f => (
            <div key={f.id} className={styles.card}>
              <div className={styles.icon}>{f.icon}</div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
