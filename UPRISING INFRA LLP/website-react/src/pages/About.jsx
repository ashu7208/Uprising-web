import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';

function WordReveal({ text, maskClass, wordClass, index = 0 }) {
  return (
    <>
      {text.split(/\s+/).map((word, wordIndex) => (
        <Fragment key={`${word}-${index + wordIndex}`}>
          {wordIndex > 0 ? ' ' : null}
          <span className={maskClass} aria-hidden="true">
            <span className={wordClass} style={{ '--word-i': index + wordIndex, '--word-index': index + wordIndex }}>{word}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

function LetterReveal({ value, index }) {
  return (
    <strong className="company-detail-value" aria-label={value}>
      {Array.from(value).map((character, characterIndex) => (
        <span
          className="company-value-letter"
          aria-hidden="true"
          style={{ '--i': index, '--letter-i': characterIndex }}
          key={`${character}-${characterIndex}`}
        >
          {character}
        </span>
      ))}
    </strong>
  );
}

function SplitLetters({ value, index }) {
  return (
    <>
      {Array.from(value).map((character, characterIndex) => (
        /\s/.test(character) ? character : (
          <span className="vals-letter-mask" aria-hidden="true" key={`${character}-${characterIndex}`}>
            <span className="vals-letter-inner" style={{ '--i': index, '--letter-i': characterIndex }}>{character}</span>
          </span>
        )
      ))}
    </>
  );
}

function CopyDetailButton({ label, value }) {
  const [message, setMessage] = useState('');
  const resetTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const handleCopy = async () => {
    let copied = false;
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch (error) {
        console.warn('Clipboard API failed; trying the textarea fallback.', error);
        copied = false;
      }
    }

    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.append(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } catch (error) {
        console.error('Unable to copy the company detail.', error);
      } finally {
        textarea.remove();
      }
    }

    setMessage(copied ? 'Copied' : 'Copy failed. Select the value to copy it.');
    window.clearTimeout(resetTimer.current);
    if (copied) resetTimer.current = window.setTimeout(() => setMessage(''), 1600);
  };

  return (
    <button className={`company-detail-copy${message === 'Copied' ? ' is-copied' : ''}`} type="button" onClick={handleCopy} aria-label={message === 'Copied' ? 'Copied!' : `Copy ${label}`} title={message || `Copy ${label}`}>
      <svg className="copy-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      <svg className="check-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m5 12 4.5 4.5L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sr-only" aria-live="polite">{message}</span>
    </button>
  );
}

function SnapshotStat({ target, suffix = '', label, index = 0 }) {
  const [replay, setReplay] = useState(0);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setReplay((current) => current + 1);
    }
  };

  return (
    <div
      className="mini-stat"
      role="button"
      tabIndex={0}
      data-target={target}
      aria-label={`${target}${suffix} ${label}. Replay count animation.`}
      onClick={() => setReplay((current) => current + 1)}
      onKeyDown={handleKeyDown}
    >
      <strong><span className="mini-stat-count"><AnimatedCounter target={target} replay={replay} startDelay={2500 + index * 150} duration={1700} /></span>{suffix && <span aria-hidden="true">{suffix}</span>}</strong>
      <span>{label}</span>
    </div>
  );
}

const values = [
  { title: 'Integrity', text: 'We say what we do and do what we say.' },
  { title: 'Quality', text: 'We never compromise on materials or workmanship.' },
  { title: 'Safety', text: 'The wellbeing of our people and clients comes first.' },
  { title: 'Commitment', text: 'We respect deadlines and budgets.' },
  { title: 'Sustainability', text: 'We promote water conservation and efficient energy use.' }
];

export default function About() {
  const [activeService, setActiveService] = useState(null);

  return (
    <main id="main" className="about-main">
      <section className="about-hero" aria-labelledby="about-hero-title">
        <div className="pic" aria-hidden="true">
          <span className="about-hero-sun" />
          <span className="about-hero-beacon" />
          <span className="about-hero-window about-hero-window--1" />
          <span className="about-hero-window about-hero-window--2" />
          <span className="about-hero-window about-hero-window--3" />
          <span className="about-hero-window about-hero-window--4" />
          <span className="about-hero-sheen" />
        </div>
        <div className="about-hero-inner">
          <nav className="about-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span><span>About</span>
          </nav>
          <span className="about-hero-eyebrow">ABOUT US</span>
          <h1 id="about-hero-title" aria-label="Infrastructure solutions built on trust and commitment">
            <span className="about-hero-word-mask"><span className="about-hero-word">Infrastructure</span></span>
            <span className="about-hero-word-mask"><span className="about-hero-word">solutions</span></span>
            <span className="about-hero-word-mask"><span className="about-hero-word">built</span></span>
            <span className="about-hero-word-mask"><span className="about-hero-word">on</span></span>
            <span className="about-hero-word-mask"><span className="about-hero-word">trust</span></span>
            <span className="about-hero-word-mask"><span className="about-hero-word">and</span></span>
            <span className="about-hero-word-mask"><span className="about-hero-word">commitment</span></span>
          </h1>
          <p>Uprising Infra LLP is a Mumbai-based company working across civil construction, electrical works and water treatment systems.</p>
          <div className="about-hero-stats" aria-label="Company snapshot">
            <SnapshotStat target={20} suffix="+" label="PROJECTS COMPLETED" index={0} />
            <SnapshotStat target={6} suffix="+" label="YEARS OF EXPERIENCE" index={1} />
            <SnapshotStat target={3} label="CORE SERVICES" index={2} />
          </div>
        </div>
      </section>

      <section className="who-services-section" aria-labelledby="who-we-are-title">
        <div className="who-services-grid">
          <div className="who-services-left">
            <header className="who-services-heading">
              <span className="who-services-eyebrow">WHO WE ARE</span>
              <h2 id="who-we-are-title" aria-label="Built on honesty, quality and long-term relationships.">
                <span className="who-services-mask"><span className="who-services-word">Built</span></span>
                <span className="who-services-mask"><span className="who-services-word">on</span></span>
                <span className="who-services-mask"><span className="who-services-word">honesty,</span></span>
                <span className="who-services-mask"><span className="who-services-word">quality</span></span>
                <span className="who-services-mask"><span className="who-services-word">and</span></span>
                <span className="who-services-mask"><span className="who-services-word">long-term</span></span>
                <span className="who-services-mask"><span className="who-services-word">relationships.</span></span>
              </h2>
            </header>
            <div className="who-services-copy">
              <p className="who-services-paragraph who-services-paragraph--first">Uprising Infra LLP is a registered Limited Liability Partnership based in Mumbai, Maharashtra. We specialise in <span className="who-services-highlight">civil construction</span>, <span className="who-services-highlight">electrical works</span> and <span className="who-services-highlight">water treatment systems</span>. Our name reflects our belief: every project is a step towards growth, and every client relationship should rise with it.</p>
              <p className="who-services-paragraph who-services-paragraph--second">From residential developments to industrial and commercial work, we focus on practical execution, transparent communication and dependable results that stand the test of time.</p>
            </div>
          </div>

          <div className="who-services-card-wrap">
            <div className="who-services-card">
              <span className="who-services-glare" aria-hidden="true" />
              <span className="who-services-light" aria-hidden="true" />
              <h3>What We Do</h3>
              <div className="who-service-list">
                <div className={`who-service-row${activeService === 0 ? ' is-open' : ''}`} role="button" tabIndex={0} aria-expanded={activeService === 0} onClick={() => setActiveService(activeService === 0 ? null : 0)} onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveService(activeService === 0 ? null : 0);
                  }
                }}>
                  <span className="who-service-icon" aria-hidden="true"><svg className="who-crane-icon" viewBox="0 0 48 48" fill="none"><path className="crane-structure" d="M12 41V8h29M12 13h29M20 8l-8 5m8-5v5m8-5v5m8-5v5M12 41h12m-12-8h8m-8-8h8m-8-8h8M37 13v13" /><path className="crane-hook" d="M37 26v5a4 4 0 0 1-8 0v-2" /></svg></span>
                  <span className="who-service-copy"><span className="who-service-title">Civil Construction</span><span className="who-service-description">Buildings, RCC works, repairs, waterproofing and finishing.</span><span className="who-service-tags"><span className="who-service-tags-inner"><span>Buildings</span><span>RCC &amp; repairs</span><span>Waterproofing</span><span>Roads &amp; drainage</span></span></span></span>
                  <span className="who-service-chevron" aria-hidden="true">›</span>
                </div>
                <div className={`who-service-row${activeService === 1 ? ' is-open' : ''}`} role="button" tabIndex={0} aria-expanded={activeService === 1} onClick={() => setActiveService(activeService === 1 ? null : 1)} onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveService(activeService === 1 ? null : 1);
                  }
                }}>
                  <span className="who-service-icon" aria-hidden="true"><svg className="who-bolt-icon" viewBox="0 0 48 48" fill="none"><path d="M27 4 11 27h11l-2 17 17-24H25l2-16Z" /></svg></span>
                  <span className="who-service-copy"><span className="who-service-title">Electrical Works</span><span className="who-service-description">Wiring, panels, earthing, lighting and maintenance (AMC).</span><span className="who-service-tags"><span className="who-service-tags-inner"><span>Wiring</span><span>Panels</span><span>Earthing</span><span>Lighting</span><span>AMC</span></span></span></span>
                  <span className="who-service-chevron" aria-hidden="true">›</span>
                </div>
                <div className={`who-service-row who-service-row--water${activeService === 2 ? ' is-open' : ''}`} role="button" tabIndex={0} aria-expanded={activeService === 2} onClick={() => setActiveService(activeService === 2 ? null : 2)} onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveService(activeService === 2 ? null : 2);
                  }
                }}>
                  <span className="who-service-icon" aria-hidden="true"><svg className="who-water-icon" viewBox="0 0 48 48" fill="none"><path className="water-drop" d="M24 5c-5 8-11 14-11 22a11 11 0 0 0 22 0C35 19 29 13 24 5Z" /><path className="water-wave" d="M7 39c4-3 7-3 11 0s7 3 11 0 7-3 12 0" /></svg></span>
                  <span className="who-service-copy"><span className="who-service-title">Water Treatment</span><span className="who-service-description">STP, ETP and WTP plants, RO systems and upkeep.</span><span className="who-service-tags"><span className="who-service-tags-inner"><span>STP</span><span>ETP</span><span>WTP</span><span>RO plants</span><span>O&amp;M</span></span></span></span>
                  <span className="who-service-chevron" aria-hidden="true">›</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-points mv" id="mv">
        <div className="mv-bg" aria-hidden="true" />
        <div className="container rv">
          <article className="card">
            <span className="shine" aria-hidden="true" />
            <span className="no" aria-hidden="true">01</span>
            <div className="eb">
              <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle pathLength={1} cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="3.5" /><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" /></svg></span>
              <i aria-hidden="true" /><span className="lb">Our Mission</span>
            </div>
            <h3 aria-label="Deliver safe, durable and cost-effective infrastructure solutions.">
              <WordReveal text="Deliver" maskClass="mv-word" wordClass="mv-word-inner" />
              {' '}<em><WordReveal text="safe, durable and cost-effective" maskClass="mv-word" wordClass="mv-word-inner" index={1} /></em>
              {' '}<WordReveal text="infrastructure solutions." maskClass="mv-word" wordClass="mv-word-inner" index={5} />
            </h3>
            <p>To deliver safe, durable and cost-effective infrastructure solutions that exceed client expectations, while maintaining <strong>honesty, quality and timely completion.</strong></p>
            <ul className="chips" aria-label="Mission principles">
              <li style={{ '--i': 0 }}>Safe</li><li style={{ '--i': 1 }}>Durable</li><li style={{ '--i': 2 }}>Cost-effective</li>
            </ul>
          </article>

          <article className="card">
            <span className="shine" aria-hidden="true" />
            <span className="no" aria-hidden="true">02</span>
            <div className="eb">
              <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path pathLength={1} d="M2 12s3.7-7 10-7 10 7 10 7-3.7 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3.2" /></svg></span>
              <i aria-hidden="true" /><span className="lb">Our Vision</span>
            </div>
            <h3 aria-label="Be one of Mumbai’s most trusted infrastructure companies.">
              <WordReveal text="Be one of Mumbai’s" maskClass="mv-word" wordClass="mv-word-inner" />
              {' '}<em><WordReveal text="most trusted" maskClass="mv-word" wordClass="mv-word-inner" index={4} /></em>
              {' '}<WordReveal text="infrastructure companies." maskClass="mv-word" wordClass="mv-word-inner" index={6} />
            </h3>
            <p>To become one of Mumbai's most trusted infrastructure companies, known for <strong>integrity, innovation and long-term client relationships.</strong></p>
            <ul className="chips" aria-label="Vision principles">
              <li style={{ '--i': 0 }}>Integrity</li><li style={{ '--i': 1 }}>Innovation</li><li style={{ '--i': 2 }}>Long-term trust</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="about-values" id="vals">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow"><span className="vals-eyebrow-label">Our Values</span></span>
            <h2 aria-label="What guides every project we take on.">
              <WordReveal text="What guides" maskClass="vals-word-mask" wordClass="vals-word-inner" />
              {' '}<em><WordReveal text="every project" maskClass="vals-word-mask" wordClass="vals-word-inner" index={2} /></em>
              {' '}<WordReveal text="we take on." maskClass="vals-word-mask" wordClass="vals-word-inner" index={4} />
            </h2>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div className="rv" style={{ '--i': index }} key={value.title}>
                <article className="card">
                  <span className="no" aria-hidden="true">0{index + 1}</span>
                  <span className="ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path pathLength="1" d="M12 3 19 6v5c0 4.7-2.8 8-7 10-4.2-2-7-5.3-7-10V6l7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path pathLength="1" d="m8.5 12 2.2 2.2 4.8-4.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <h3 aria-label={value.title}><SplitLetters value={value.title} index={index} /></h3>
                  <p>{value.text}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-leadership" id="about-leadership">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow"><span className="leadership-eyebrow-label">Leadership</span></span>
            <h2 aria-label="Led by a hands-on construction leader.">
              <WordReveal text="Led by a hands-on construction leader." maskClass="leader-heading-mask" wordClass="leader-heading-word" />
            </h2>
          </div>

          <div className="leadership-panel">
            <div className="leader-photo-wrap">
              <img src="/assets/director-ajay.jpg" alt="Ajay Shivnath Vishwakarma, CEO and Designated Partner of Uprising Infra LLP" />
            </div>

            <div className="leader-content">
              <span className="leader-role">CEO &amp; Designated Partner</span>
              <h3 aria-label="Ajay Shivnath Vishwakarma">
                <WordReveal text="Ajay Shivnath Vishwakarma" maskClass="leader-name-mask" wordClass="leader-name-word" />
              </h3>
              <p className="leader-subtitle">Designated Partner at Uprising Infra LLP since 20 July 2020</p>
              <p>Ajay Shivnath Vishwakarma has led Uprising Infra LLP since its early operations. He oversees the firm's civil construction, electrical and water treatment projects from planning through execution, with hands-on involvement in site management, vendor coordination and quality control across residential, commercial and industrial work in Mumbai.</p>
              <div className="leader-tags">
                <span style={{ '--tag-i': 0 }}>Site Management</span>
                <span style={{ '--tag-i': 1 }}>Vendor Coordination</span>
                <span style={{ '--tag-i': 2 }}>Quality Control</span>
                <span style={{ '--tag-i': 3 }}>Planning to Execution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-company cd" id="about-company">
        <div className="cd-bg" aria-hidden="true" />
        <div className="container company-detail-wrap">
          <div className="section-header">
            <span className="eyebrow"><span className="company-eyebrow-label">Company Details</span></span>
          <h2 aria-label="Transparent, accountable and committed to long-term trust.">
            <WordReveal text="Transparent, accountable and" maskClass="company-heading-mask" wordClass="company-heading-word" />
            {' '}<em><WordReveal text="committed" maskClass="company-heading-mask" wordClass="company-heading-word" index={3} /></em>
            {' '}<WordReveal text="to long-term trust." maskClass="company-heading-mask" wordClass="company-heading-word" index={4} />
          </h2>
          </div>
          <div className="company-detail-panel">
            <div className="company-detail-grid">
            <div className="company-detail-box" style={{ '--i': 0 }}>
                <span className="company-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3 21h18M5 21V5l7-2v18M12 9h7v12M8 7h1M8 11h1M8 15h1M15 12h1M15 16h1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span className="company-detail-text"><span className="company-detail-label">Company Name</span><LetterReveal value="Uprising Infra LLP" index={0} /></span>
                <CopyDetailButton label="company name" value="Uprising Infra LLP" />
              </div>
              <div className="company-detail-box" style={{ '--i': 1 }}>
                <span className="company-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M14 3v5h5M8 13h8M8 17h6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span className="company-detail-text"><span className="company-detail-label">LLPIN</span><LetterReveal value="AAS-6610" index={1} /></span>
                <CopyDetailButton label="LLPIN" value="AAS-6610" />
              </div>
              <div className="company-detail-box" style={{ '--i': 2 }}>
                <span className="company-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 3h16v18l-3-2-3 2-3-2-3 2-4-2V3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M8 8h8M8 12h2M14 12h2M8 16h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></span>
                <span className="company-detail-text"><span className="company-detail-label">GST No.</span><LetterReveal value="27AAGFU3924K1ZU" index={2} /></span>
                <CopyDetailButton label="GST number" value="27AAGFU3924K1ZU" />
              </div>
              <div className="company-detail-box" style={{ '--i': 3 }}>
                <span className="company-detail-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3 5h18v14H3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="m4 6 8 7 8-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span className="company-detail-text"><span className="company-detail-label">Email</span><LetterReveal value="uprisingmumbai@gmail.com" index={3} /></span>
                <CopyDetailButton label="email" value="uprisingmumbai@gmail.com" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Need an infrastructure solution?</h2>
            <p>Contact Uprising Infra LLP for a free site visit and quotation.</p>
            <div className="cta-actions">
              <Link to="/contact" className="btn btn-light"><span>Get a Free Quote</span></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
