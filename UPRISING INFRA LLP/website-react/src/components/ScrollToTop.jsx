import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop({ lenisRef }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (target && lenisRef?.current) {
          lenisRef.current.scrollTo(target);
        } else {
          target?.scrollIntoView();
        }
      } else if (lenisRef?.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, lenisRef]);

  return null;
}
