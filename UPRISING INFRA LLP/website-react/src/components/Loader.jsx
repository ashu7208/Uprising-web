import { useEffect, useState } from 'react';

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let hideTimer;
    let removeTimer;
    let fallbackTimer;
    let started = false;
    const hide = () => {
      if (started) return;
      started = true;
      window.clearTimeout(fallbackTimer);
      hideTimer = window.setTimeout(() => setVisible(false), 280);
      removeTimer = window.setTimeout(() => setMounted(false), 900);
    };

    fallbackTimer = window.setTimeout(hide, 1400);
    if (document.readyState === 'complete') hide();
    else window.addEventListener('load', hide, { once: true });
    return () => {
      window.removeEventListener('load', hide);
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`loader${visible ? '' : ' hide'}`} aria-hidden="true">
      <div className="loader-mark">
        <div className="loader-ring">
          <svg viewBox="0 0 100 100" fill="none">
            <path d="M50 12 A38 38 0 1 1 12 50" stroke="#E1452A" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="loader-text">UPRISING INFRA</div>
      </div>
    </div>
  );
}
