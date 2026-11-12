import { useEffect, useState } from 'react';

const digitHeight = 1.08;
const baseDuration = 1500;
const digitDurationStep = 350;

export default function OdometerCounter({ target, suffix = '', run }) {
  const [phase, setPhase] = useState('final');
  const digits = String(target).split('');
  const longestDigitRun = baseDuration + Math.max(0, digits.length - 1) * digitDurationStep;
  const plusRun = suffix ? 1920 : 0;

  useEffect(() => {
    if (run === 0) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return undefined;
    }

    setPhase('reset');
    const frame = window.requestAnimationFrame(() => setPhase('rolling'));
    const timer = window.setTimeout(() => setPhase('done'), Math.max(longestDigitRun, plusRun) + 100);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [longestDigitRun, plusRun, run]);

  return (
    <strong className="number-value" aria-hidden="true">
      <span className="odometer-value" data-phase={phase}>
        {digits.map((digit, index) => {
          const value = Number(digit);
          const placeFromRight = digits.length - index - 1;
          const rollPosition = value + (placeFromRight === 0 ? 10 : 0);
          const position = phase === 'reset'
            ? 0
            : phase === 'rolling' || phase === 'done'
              ? rollPosition
              : value;

          return (
            <span className="odometer-column" key={`${index}-${digit}`}>
              <span
                className="odometer-track"
                style={{
                  transform: `translateY(-${position * digitHeight}em)`,
                  '--digit-duration': `${baseDuration + placeFromRight * digitDurationStep}ms`
                }}
              >
                {Array.from({ length: 20 }, (_, sequenceIndex) => (
                  <span className="odometer-digit" key={sequenceIndex}>
                    {sequenceIndex % 10}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
      {suffix && <span className="odometer-suffix">{suffix}</span>}
    </strong>
  );
}
