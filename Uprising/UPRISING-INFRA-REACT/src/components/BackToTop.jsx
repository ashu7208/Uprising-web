import { useEffect, useState } from 'react';

export default function BackToTop({ lenisRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      className="to-top show"
      aria-label="Back to top"
      onClick={() => {
        if (lenisRef?.current) lenisRef.current.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <svg viewBox="0 0 16 16" fill="none">
        <path d="M8 13V3M3 7l5-5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
