import { useEffect, useRef, useState } from 'react';

export default function AnimatedCounter({ target, suffix = '', replay = 0, startDelay = 0, duration = 1400, onStart }) {
  const counterRef = useRef(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let timer;
    let observer;

    const animate = () => {
      onStart?.();
      if (reducedMotion) {
        setValue(target);
        return;
      }

      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(target * eased));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      setValue(0);
      frame = window.requestAnimationFrame(tick);
    };
    const schedule = (delay) => {
      if (reducedMotion || delay <= 0) animate();
      else timer = window.setTimeout(animate, delay);
    };

    if (replay > 0) {
      schedule(0);
    } else if (reducedMotion || !('IntersectionObserver' in window)) {
      schedule(0);
    } else {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          schedule(startDelay);
          observer.disconnect();
        }
      }, { threshold: 0.4 });
      observer.observe(element);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer?.disconnect();
    };
  }, [duration, onStart, replay, startDelay, suffix, target]);

  return <span ref={counterRef}>{value}{suffix}</span>;
}
