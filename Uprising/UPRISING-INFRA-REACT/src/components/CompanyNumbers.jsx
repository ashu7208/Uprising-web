import { useEffect, useRef, useState } from 'react';
import OdometerCounter from './OdometerCounter';

const figures = [
  { target: 20, label: 'Projects Completed', icon: 'check' },
  { target: 20, label: 'Satisfied Clients', icon: 'heart' },
  { target: 6, suffix: '+', label: 'Years of Experience', icon: 'clock' },
  { target: 3, label: 'Core Services', icon: 'orbit' }
];

const burstColors = ['#e1301f', '#f0b429', '#368fc4'];

function NumberCard({ figure, index, replayAll }) {
  const cardRef = useRef(null);
  const hasAutoPlayed = useRef(false);
  const burstTimer = useRef(null);
  const burstId = useRef(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [run, setRun] = useState(0);
  const [burst, setBurst] = useState(null);

  useEffect(() => {
    const card = cardRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const reveal = () => {
      setIsRevealed(true);
      if (reducedMotion.matches || hasAutoPlayed.current) return;
      hasAutoPlayed.current = true;
      setRun((current) => current + 1);
    };

    if (reducedMotion.matches) {
      setHasRevealed(true);
      return undefined;
    }

    if (!('IntersectionObserver' in window)) {
      reveal();
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          reveal();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (replayAll === 0) return;
    hasAutoPlayed.current = true;
    setIsRevealed(true);
    setRun((current) => current + 1);
  }, [replayAll]);

  useEffect(() => () => window.clearTimeout(burstTimer.current), []);

  const handleClick = (event) => {
    hasAutoPlayed.current = true;
    setIsRevealed(true);
    setRun((current) => current + 1);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.detail === 0 ? rect.width / 2 : event.clientX - rect.left;
    const y = event.detail === 0 ? rect.height / 2 : event.clientY - rect.top;
    setBurst({ id: ++burstId.current, x, y });
    window.clearTimeout(burstTimer.current);
    burstTimer.current = window.setTimeout(() => setBurst(null), 1200);
  };

  return (
    <button
      ref={cardRef}
      className={`number-card${isRevealed ? ' is-revealed' : ''}${hasRevealed ? ' has-revealed' : ''}`}
      type="button"
      aria-label={`${figure.target}${figure.suffix || ''} ${figure.label}. Activate to replay the counter.`}
      onClick={handleClick}
      onAnimationEnd={(event) => {
        if (event.animationName === 'numberCardIn') {
          setIsRevealed(false);
          setHasRevealed(true);
        }
      }}
      style={{ '--card-index': index }}
    >
      {burst && Array.from({ length: 10 }, (_, dotIndex) => {
        const angle = (Math.PI * 2 * dotIndex) / 10;
        return (
          <span
            className="number-burst-dot"
            aria-hidden="true"
            key={`${burst.id}-${dotIndex}`}
            style={{
              left: `${burst.x}px`,
              top: `${burst.y}px`,
              backgroundColor: burstColors[dotIndex % burstColors.length],
              '--burst-x': `${Math.cos(angle) * 70}px`,
              '--burst-y': `${Math.sin(angle) * 70}px`
            }}
          />
        );
      })}
      <span className="number-icon-ring" aria-hidden="true">
        <svg className={`number-icon number-icon--${figure.icon}`} viewBox="0 0 48 48" fill="none">
          {figure.icon === 'check' && (
            <>
              <circle pathLength="1" cx="24" cy="24" r="17" />
              <path className="number-check-path" pathLength="1" d="m15 24 6 6 13-14" />
            </>
          )}
          {figure.icon === 'heart' && (
            <path pathLength="1" d="M24 39S7 29 7 17a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22Z" />
          )}
          {figure.icon === 'clock' && (
            <>
              <circle pathLength="1" cx="24" cy="24" r="17" />
              <path pathLength="1" d="M24 13v11" />
              <path className="number-clock-hand" pathLength="1" d="m24 24 9 5" />
            </>
          )}
          {figure.icon === 'orbit' && (
            <>
              <circle className="orbit-center" cx="24" cy="24" r="4" />
              <g className="number-orbit-dots">
                <circle cx="24" cy="9" r="3" />
                <circle cx="37" cy="32" r="3" />
                <circle cx="11" cy="32" r="3" />
              </g>
            </>
          )}
        </svg>
      </span>
      <OdometerCounter target={figure.target} suffix={figure.suffix} run={run} />
      <span className="number-label">{figure.label}</span>
    </button>
  );
}

export default function CompanyNumbers() {
  const [replayAll, setReplayAll] = useState(0);

  return (
    <section className="section numbers-section" id="numbers" aria-labelledby="numbers-title">
      <div className="numbers-background" aria-hidden="true" />
      <div className="numbers-inner">
        <header className="numbers-heading">
          <span className="numbers-eyebrow">Our Numbers</span>
          <h2 id="numbers-title" aria-label="Built on real work and client relationships">
            <span className="numbers-word-mask"><span className="numbers-word">Built</span></span>{' '}
            <span className="numbers-word-mask"><span className="numbers-word">on</span></span>{' '}
            <span className="numbers-word-mask"><span className="numbers-word">real</span></span>{' '}
            <span className="numbers-word-mask"><span className="numbers-word">work</span></span>{' '}
            <span className="numbers-word-mask"><span className="numbers-word">and</span></span>{' '}
            <span className="numbers-word-mask"><span className="numbers-word">client</span></span>{' '}
            <span className="numbers-word-mask"><span className="numbers-word">relationships</span></span>
          </h2>
        </header>
        <div className="numbers-grid">
          {figures.map((figure, index) => (
            <NumberCard
              figure={figure}
              index={index}
              key={figure.label}
              replayAll={replayAll}
            />
          ))}
        </div>
        <button
          className="numbers-hint"
          type="button"
          onClick={() => setReplayAll((current) => current + 1)}
          aria-label="Replay all number counters"
        >
          Tap any number to replay
        </button>
      </div>
    </section>
  );
}
