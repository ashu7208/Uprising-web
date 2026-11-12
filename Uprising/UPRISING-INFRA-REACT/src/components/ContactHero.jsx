import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const words = ['Ready', 'to', 'start', 'your', 'project?'];
const letterCount = words.reduce((total, word) => total + word.length, 0);

export default function ContactHero() {
  const [typedCount, setTypedCount] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [complete, setComplete] = useState(false);
  const headingRef = useRef(null);
  const cursorRef = useRef(null);
  const positionCursorRef = useRef(() => {});

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedCount(letterCount);
      setComplete(true);
      return undefined;
    }

    setAnimated(true);
    const timers = new Set();
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        callback();
      }, delay);
      timers.add(timer);
    };
    const typeNext = (index) => {
      if (index >= letterCount) {
        schedule(() => setComplete(true), 900);
        return;
      }
      setTypedCount(index + 1);
      schedule(() => typeNext(index + 1), 60 + Math.random() * 50);
    };
    schedule(() => typeNext(0), 600);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useEffect(() => {
    positionCursorRef.current = () => {
      const heading = headingRef.current;
      const cursor = cursorRef.current;
      if (!heading || !cursor || complete) return;
      const visibleLetters = heading.querySelectorAll('.contact-type-letter.is-visible');
      const lastLetter = visibleLetters[visibleLetters.length - 1];
      if (!lastLetter) return;
      const letterRect = lastLetter.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      cursor.style.left = `${letterRect.right - headingRect.left + heading.scrollLeft}px`;
      cursor.style.top = `${letterRect.top - headingRect.top + heading.scrollTop + letterRect.height * 0.1}px`;
      cursor.style.height = `${letterRect.height * 0.8}px`;
    };
    positionCursorRef.current();
  }, [typedCount, complete]);

  useEffect(() => {
    const updateCursor = () => positionCursorRef.current();
    window.addEventListener('resize', updateCursor);
    return () => window.removeEventListener('resize', updateCursor);
  }, []);

  let currentLetter = 0;
  return (
    <section className={`page-hero contact-page-hero${animated ? ' contact-hero-animated contact-typewriter-active' : ''}${complete ? ' contact-subtitle-visible' : ''}`}>
      <div className="container">
        <div className="breadcrumb"><Link to="/">Home</Link><span className="sep">/</span><span>Contact Us</span></div>
        <span className="eyebrow">Contact Us</span>
        <h1 ref={headingRef} aria-label="Ready to start your project?">
          {words.map((word, wordIndex) => {
            const letters = Array.from(word).map((letter) => {
              const visible = currentLetter < typedCount;
              currentLetter += 1;
              return <span className={`contact-type-letter${visible ? ' is-visible' : ''}`} key={`${letter}-${currentLetter}`}>{letter}</span>;
            });
            const wordContent = wordIndex === words.length - 1 ? <em className="contact-type-accent">{letters}</em> : <span>{letters}</span>;
            return (
              <span className="contact-type-word" key={word} style={{ marginRight: wordIndex < words.length - 1 ? '0.2em' : undefined }}>
                {wordContent}
              </span>
            );
          })}
          <span ref={cursorRef} className="contact-typewriter-cursor" aria-hidden="true" hidden={complete} />
        </h1>
        <p className="contact-page-subtitle">Talk to Uprising Infra LLP today and get a free site visit and quotation.</p>
      </div>
    </section>
  );
}
