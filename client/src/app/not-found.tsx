import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      textAlign: 'center',
      padding: '24px',
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)'
    }}>
      <h1 style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: 'clamp(4rem, 8vw, 8rem)',
        color: 'var(--color-gold)',
        margin: '0',
        lineHeight: 1
      }}>404</h1>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 400,
        marginTop: '16px',
        marginBottom: '24px',
        letterSpacing: '0.05em'
      }}>Page Introuvable</h2>
      <p style={{
        color: 'var(--color-grey-light)',
        maxWidth: '400px',
        lineHeight: 1.6,
        marginBottom: '40px'
      }}>
        La page que vous recherchez semble avoir disparu. Explorez nos collections pour découvrir votre prochaine pièce maîtresse.
      </p>
      <Link href="/shop" style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '48px',
        padding: '0 32px',
        backgroundColor: 'var(--color-gold)',
        color: 'var(--color-bg)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontSize: '13px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
        borderRadius: '24px'
      }}>
        Retour à la boutique
      </Link>
    </div>
  );
}
