import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import Clients from '../components/Clients';
import CompanyNumbers from '../components/CompanyNumbers';
import FAQ from '../components/FAQ';
import LeadershipFeature from '../components/LeadershipFeature';
import { useSiteContent, findSection, textLines, textRows } from '../services/siteContent';

const serviceCards = [
  { title: 'One Company. Complete Infrastructure Solutions.', detail: 'Civil, electrical and water treatment under one roof, with a single point of responsibility.', icon: 'building' },
  { title: 'Civil Construction', detail: 'Buildings, RCC and structural repair, waterproofing, roads and finishing.', icon: 'crane' },
  { title: 'Electrical Works', detail: 'Wiring, panels, cable laying, earthing, lighting and AMC.', icon: 'bolt' },
  { title: 'Water Treatment', detail: 'STP, ETP and WTP plants, RO systems, and operation and maintenance.', icon: 'water' }
];

const whyCards = [
  { title: 'Three Services, One Partner', text: 'Civil, electrical and water treatment under one roof.' },
  { title: 'Quality Materials and Workmanship', text: 'We use trusted materials and follow proper standards.' },
  { title: 'Skilled Team', text: 'Experienced engineers, supervisors and technicians.' },
  { title: 'On-Time Delivery', text: 'Clear schedules and regular progress updates.' },
  { title: 'Transparent Pricing', text: 'Detailed quotations with no hidden costs.' },
  { title: 'Safety First', text: 'Safe working practices on every site.' },
  { title: 'After-Work Support', text: 'We stand by our work even after handover.' }
];

const processSteps = [
  { number: 1, title: 'Enquiry and Site Visit', summary: 'You contact us and we visit your site.', detail: 'Call, WhatsApp or email us. We visit your site, understand the scope and take measurements.' },
  { number: 2, title: 'Planning and Quotation', summary: 'We prepare a detailed scope, timeline and cost.', detail: 'You receive a detailed scope, timeline and itemised cost, with no hidden charges.' },
  { number: 3, title: 'Approval and Agreement', summary: 'Work begins after your confirmation.', detail: 'Review the quotation, confirm and sign. Work is scheduled only after your approval.' },
  { number: 4, title: 'Execution', summary: 'Our team completes the work with regular supervision.', detail: 'Our engineers and technicians carry out the work, with regular supervision and updates.' },
  { number: 5, title: 'Quality Check and Handover', summary: 'Final inspection and clean handover.', detail: 'We inspect every detail, fix snags and hand over a clean, ready-to-use site.' },
  { number: 6, title: 'Support', summary: 'Maintenance and service whenever you need us.', detail: 'Maintenance and service contracts, with quick response whenever you need us.' }
];

function ProcessArt({ step }) {
  const illustrations = [
    <svg className="process-art process-art--pin" viewBox="0 0 320 92" fill="none" aria-hidden="true">
      <ellipse className="pin-ripple" cx="160" cy="73" rx="8" ry="3" />
      <path className="pin-shape" d="M160 12c-12 0-21 9-21 21 0 16 21 37 21 37s21-21 21-37c0-12-9-21-21-21Z" />
      <circle cx="160" cy="33" r="6" />
    </svg>,
    <svg className="process-art process-art--document" viewBox="0 0 320 92" fill="none" aria-hidden="true">
      <path className="doc-outline" d="M116 13h57l24 23v43h-81V13Z" />
      <path className="doc-fold" d="M173 13v23h24" />
      <path className="doc-line doc-line--one" d="M130 48h52" />
      <path className="doc-line doc-line--two" d="M130 59h42" />
      <path className="doc-line doc-line--three" d="M130 70h32" />
      <g className="rupee-stamp"><circle cx="220" cy="54" r="17" /><path d="M213 47h14m-14 6h14m-11-6c8 0 9 10 0 10h-3l11 9" /></g>
    </svg>,
    <svg className="process-art process-art--signature" viewBox="0 0 320 92" fill="none" aria-hidden="true">
      <path className="signature-line" d="M70 56c10-4 14-22 20-22 8 0-4 27 2 28 5 1 11-14 15-14 4 0 0 13 5 13 8 0 13-13 18-13 5 0 2 10 8 10 8 0 11-9 16-9" />
      <g className="approval-check"><circle cx="205" cy="47" r="21" /><path className="approval-tick" d="m194 47 8 8 15-17" /></g>
    </svg>,
    <svg className="process-art process-art--bricks" viewBox="0 0 320 92" fill="none" aria-hidden="true">
      <path className="brick brick--1" d="M113 66h30v12h-30z" />
      <path className="brick brick--2" d="M145 66h30v12h-30z" />
      <path className="brick brick--3" d="M177 66h30v12h-30z" />
      <path className="brick brick--4" d="M129 51h30v12h-30z" />
      <path className="brick brick--5" d="M161 51h30v12h-30z" />
      <path className="brick brick--6" d="M145 36h30v12h-30z" />
    </svg>,
    <svg className="process-art process-art--checklist" viewBox="0 0 320 92" fill="none" aria-hidden="true">
      <path className="list-line" d="M112 25h75M112 43h75M112 61h75" />
      <path className="list-tick list-tick--one" d="m94 25 5 5 9-11" />
      <path className="list-tick list-tick--two" d="m94 43 5 5 9-11" />
      <path className="list-tick list-tick--three" d="m94 61 5 5 9-11" />
      <g className="magnifier"><circle cx="211" cy="40" r="14" /><path d="m221 50 12 12" /></g>
    </svg>,
    <svg className="process-art process-art--headset" viewBox="0 0 320 92" fill="none" aria-hidden="true">
      <path className="headset-band" d="M137 49v-7a23 23 0 0 1 46 0v7" />
      <path className="headset-cup" d="M137 47h-5a5 5 0 0 0-5 5v11a5 5 0 0 0 5 5h8V47h-3Zm46 0h5a5 5 0 0 1 5 5v11a5 5 0 0 1-5 5h-8V47h3Z" />
      <path className="headset-mic" d="M183 68c-3 7-9 10-19 10h-5" />
      <path className="headset-signal headset-signal--one" d="M196 37a34 34 0 0 1 0 30" />
      <path className="headset-signal headset-signal--two" d="M204 30a44 44 0 0 1 0 44" />
    </svg>
  ];

  return <div className="process-animation" aria-hidden="true">{illustrations[step - 1]}</div>;
}

function WhyIcon({ index }) {
  const iconNames = ['orbit', 'quality', 'team', 'clock', 'rupee', 'safety', 'support'];
  return (
    <svg className={`why-icon why-icon--${iconNames[index]}`} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {index === 0 && <>
        <circle cx="24" cy="24" r="5" />
        <g className="orbit-rotator">
          <circle cx="24" cy="9" r="3" fill="currentColor" />
          <circle cx="37" cy="31" r="3" fill="currentColor" />
          <circle cx="10" cy="33" r="3" fill="currentColor" />
        </g>
        <circle cx="24" cy="24" r="14" strokeDasharray="2 4" opacity=".55" />
      </>}
      {index === 1 && <><circle cx="24" cy="24" r="17" /><path className="check-mark" d="m15 24 6 6 13-14" /></>}
      {index === 2 && <><circle cx="18" cy="16" r="6" /><circle cx="33" cy="19" r="5" /><path d="M6 39c0-7 5-12 12-12s12 5 12 12M29 29c7-2 13 3 13 10" /><g className="person-front"><circle cx="18" cy="16" r="6" /><path d="M6 39c0-7 5-12 12-12s12 5 12 12" /></g></>}
      {index === 3 && <><circle cx="24" cy="24" r="17" /><path d="M24 13v12" /><path className="clock-hand" d="M24 24 33 29" /></>}
      {index === 4 && <g className="rupee-flip"><circle cx="24" cy="24" r="17" /><path d="M17 15h15M17 21h15M20 15c7 0 9 10 0 10h-3l14 12" /></g>}
      {index === 5 && <path d="M8 28a16 16 0 0 1 32 0v5H8v-5ZM5 33h38v5H5zM24 12v4M12 17l3 3M36 17l-3 3" />}
      {index === 6 && <><path d="M8 25v-3a16 16 0 0 1 32 0v3M8 25H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h5V25H8ZM40 25h2a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-5V25h3ZM37 37c-2 5-6 7-13 7" /><path className="signal signal--one" d="M15 14a13 13 0 0 1 18 0" /><path className="signal signal--two" d="M19 18a7 7 0 0 1 10 0" /></>}
    </svg>
  );
}

const HERO_CLASSES = ['civil', 'electrical', 'water'];
const WHO_ICONS = ['building', 'crane', 'bolt', 'water'];

// Built-in text, used until the backend answers or if it is unreachable
const DEFAULT_SECTIONS = {
  Hero: {
    subtitle: 'CIVIL CONSTRUCTION | ELECTRICAL | WATER TREATMENT',
    heading: 'Building Strong Foundations. Powering Progress. Purifying Tomorrow.',
    body: 'Uprising Infra LLP delivers reliable civil construction, electrical and water treatment solutions across Mumbai with quality workmanship, safety and on-time delivery.',
    b1t: 'Get a Free Quote', b1l: '/contact', b2t: 'Our Services', b2l: '/services'
  },
  'Who We Are': {
    heading: 'A trusted partner for construction, power and water',
    body: 'Uprising Infra LLP is a Mumbai-based infrastructure company providing end-to-end solutions in civil construction, electrical installation and water treatment. We work with housing societies, builders, industries, institutions and commercial clients who need dependable execution, transparent pricing and quality that lasts.\n\nWith one trusted team handling construction, power and water systems, you save time, avoid coordination problems and get a single point of responsibility for your project.',
    items: serviceCards.map((card) => `${card.title} | ${card.detail}`).join('\n')
  },
  'Why Choose Us': {
    heading: 'One reliable team, from planning to support',
    items: whyCards.map((card) => `${card.title} | ${card.text}`).join('\n')
  },
  'Who We Serve': {
    heading: 'Infrastructure solutions for every type of client',
    items: 'Housing societies and apartment complexes\nBuilders and developers\nIndustrial units and factories\nCommercial buildings and offices\nSchools, hospitals and institutions\nIndividual property owners'
  },
  'How We Work': {
    heading: 'A clear process from enquiry to support',
    items: processSteps.map((step) => `${step.title} | ${step.summary} | ${step.detail}`).join('\n')
  },
  'Final CTA': {
    heading: 'Ready to start your project?',
    body: 'Talk to Uprising Infra LLP today and get a free site visit and quotation.',
    b1t: 'Contact Us Now', b1l: '/contact'
  }
};

const wordsOf = (text) => String(text || '').trim().split(/\s+/).filter(Boolean);
const sentencesOf = (text) => (String(text || '').match(/[^.!?]+[.!?]+|[^.!?]+$/g) || []).map((part) => part.trim()).filter(Boolean);

// Splits a heading into up to 3 lines of similar length (the headings animate line by line)
function balancedLines(text, count = 3) {
  const words = wordsOf(text);
  const target = words.join(' ').length / count;
  const lines = [];
  let current = [];
  words.forEach((word) => {
    current.push(word);
    if (current.join(' ').length >= target && lines.length < count - 1) {
      lines.push(current.join(' '));
      current = [];
    }
  });
  if (current.length) lines.push(current.join(' '));
  return lines;
}

export default function Home() {
  const [expandedService, setExpandedService] = useState(null);
  const [activeStep, setActiveStep] = useState(null);
  const site = useSiteContent();

  // Before the backend answers, use built-in text. Afterwards, a section missing or switched off in the admin panel is hidden.
  const part = (name) => (site ? findSection(site.home, name) : DEFAULT_SECTIONS[name]);
  const shown = (name) => !site || Boolean(findSection(site.home, name));

  const hero = part('Hero');
  const who = part('Who We Are');
  const why = part('Why Choose Us');
  const serve = part('Who We Serve');
  const how = part('How We Work');
  const cta = part('Final CTA');

  const heroSentences = sentencesOf(hero?.heading);
  const whoLines = balancedLines(who?.heading);
  const whoParagraphs = String(who?.body || '').split(/\n\s*\n/).map((text) => text.trim()).filter(Boolean);
  const whoCards = textRows(who?.items).map(([title, detail], index) => ({ title, detail: detail || '', icon: WHO_ICONS[index] || 'building' }));
  const whyWords = wordsOf(why?.heading);
  const whyList = textRows(why?.items).map(([title, text]) => ({ title, text: text || '' }));
  const serveItems = textLines(serve?.items);
  const howWords = wordsOf(how?.heading);
  const stepList = textRows(how?.items).map(([title, summary, detail], index) => ({
    number: index + 1, title, summary: summary || '', detail: detail || summary || ''
  }));

  return (
    <main id="main">
      {hero && (
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-stage" aria-hidden="true">
          <div className="stage-drift">
            <img className="stage-base" src="/assets/hero-infrastructure.png" alt="" fetchpriority="high" />
            <div className="panel-veil panel-veil--civil" />
            <div className="panel-veil panel-veil--electrical" />
            <div className="panel-veil panel-veil--water" />
            <div className="stage-corner" />
            <div className="stage-swoosh" />
            <span className="service-chip service-chip--civil"><span className="chip-label">Civil construction</span></span>
            <span className="service-chip service-chip--electrical"><span className="chip-label">Electrical</span></span>
            <span className="service-chip service-chip--water"><span className="chip-label">Water treatment</span></span>
            <span className="effect-ring effect-ring--excavator" />
            <span className="effect-glow" />
            <span className="effect-flash" />
            <span className="effect-ring effect-ring--transformer" />
            <span className="effect-ring effect-ring--tower" />
            <span className="effect-shimmer effect-shimmer--tank" />
            <span className="effect-ripple" />
            <span className="effect-shimmer effect-shimmer--splash" />
          </div>
        </div>

        <div className="hero-content">
          {hero.subtitle && <span className="eyebrow">{hero.subtitle}</span>}
          <h1 id="hero-title">
            {heroSentences.map((sentence, sentenceIndex) => (
              <span
                className={`hero-sentence hero-sentence--${HERO_CLASSES[Math.min(sentenceIndex, HERO_CLASSES.length - 1)]}`}
                key={`${sentenceIndex}-${sentence}`}
              >
                {wordsOf(sentence).map((word, wordIndex) => (
                  <Fragment key={wordIndex}>
                    {wordIndex > 0 && ' '}
                    <span className="word-mask"><span className="word">{word}</span></span>
                  </Fragment>
                ))}
              </span>
            ))}
          </h1>

          {hero.body && <p className="lead">{hero.body}</p>}

          <div className="hero-actions">
            {hero.b1t && <Link to={hero.b1l || '/contact'} className="btn btn-primary"><span>{hero.b1t}</span></Link>}
            {hero.b2t && <Link to={hero.b2l || '/services'} className="btn btn-outline"><span>{hero.b2t}</span></Link>}
          </div>
        </div>
      </section>
      )}

      {who && (
      <section className="who-section" id="who-we-are" aria-labelledby="who-title">
        <div className="who-background" aria-hidden="true" />
        <div className="who-content-wash" aria-hidden="true" />

        <div className="who-copy">
          <span className="who-eyebrow">Who We Are</span>
          <h2 id="who-title" aria-label={who.heading}>
            {whoLines.map((line, lineIndex) => (
              <span className="who-word-mask" key={`${lineIndex}-${line}`}><span className="who-word">{line}</span></span>
            ))}
          </h2>
          {whoParagraphs.map((paragraph, paragraphIndex) => (
            <p className={`who-paragraph ${paragraphIndex === 0 ? 'who-paragraph--first' : 'who-paragraph--second'}`} key={paragraphIndex}>{paragraph}</p>
          ))}
          <Link className="who-link" to="/about">About Uprising Infra LLP <span aria-hidden="true">→</span></Link>
        </div>

        <div className="who-card" aria-label="Explore our infrastructure services">
          <div className="who-tilt">
            <div className="who-glare" aria-hidden="true" />
            <div className="who-rows">
              {whoCards.map((item, index) => {
                const expanded = expandedService === index;
                const toggle = () => setExpandedService(expanded ? null : index);
                return (
                <div
                  className={`who-row${expanded ? ' is-open' : ''}`}
                  key={`${index}-${item.title}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded}
                  aria-controls={`who-detail-${index + 1}`}
                  onClick={toggle}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      toggle();
                    }
                  }}
                >
                  <span className={`who-icon who-icon--${item.icon}`} aria-hidden="true">
                    <svg viewBox="0 0 48 48" fill="none">
                      {item.icon === 'building' && <>
                        <path d="M7 42V12l17-6v36M24 18l17-5v29M3 42h42" />
                        <path className="window window--1" d="M13 16h4M29 21h4" />
                        <path className="window window--2" d="M13 23h4M37 19h2" />
                        <path className="window window--3" d="M13 30h4M29 28h4" />
                        <path className="window window--4" d="M37 26h2M29 35h4" />
                        <path className="window window--5" d="M37 33h2" />
                      </>}
                      {item.icon === 'crane' && <>
                        <path d="M9 42h18M18 42V8h25M18 13h25M25 8l-7 5M24 13l-6 7M43 8v5M39 13l4 4 4-4M43 17v11M8 42V25h10M4 25h8" />
                        <path className="hook" d="M43 28v5a4 4 0 0 1-8 0v-2" />
                      </>}
                      {item.icon === 'bolt' && <path d="M27 4 10 27h12l-2 17 18-25H25l2-15Z" />}
                      {item.icon === 'water' && <>
                        <path className="drop" d="M24 4S12 18 12 27a12 12 0 0 0 24 0C36 18 24 4 24 4Z" />
                        <path className="wave wave--one" d="M7 37c3-3 6-3 9 0s6 3 9 0 6-3 9 0 6-3 9 0" />
                        <path className="wave wave--two" d="M7 43c3-3 6-3 9 0s6 3 9 0 6-3 9 0 6-3 9 0" />
                      </>}
                    </svg>
                  </span>
                  <span className="who-row-copy">
                    <span className="who-row-title">{item.title}</span>
                    <span className="who-detail" id={`who-detail-${index + 1}`} aria-hidden={!expanded}>{item.detail}</span>
                  </span>
                  <span className="who-chevron" aria-hidden="true">›</span>
                </div>
                );
              })}
            </div>
            <div className={`who-hint${expandedService !== null ? ' is-hidden' : ''}`}><span className="who-hint-dot" /> <span>Tap a row to explore</span></div>
          </div>
          <span className="who-glow" aria-hidden="true" />
          <span className="who-helmet-ping" aria-hidden="true" />
        </div>
        <span className="who-sky-sheen" aria-hidden="true" />
      </section>
      )}

      {why && (
      <section className="why-section" id="why-choose-us" aria-labelledby="why-title">
        <div className="fx why-fixed-bg" aria-hidden="true" />
        <div className="why-content">
          <header className="why-heading">
            <span className="why-eyebrow">Why Choose Us</span>
            <h2 id="why-title" aria-label={why.heading}>
              {whyWords.map((word, wordIndex) => (
                <span className="why-word-mask" key={`${wordIndex}-${word}`}><span className="why-word">{word}</span></span>
              ))}
            </h2>
          </header>
          <div className="why-grid">
            {whyList.map((item, index) => (
              <article className={`why-card${index === 0 ? ' why-card--lead' : ''}`} key={`${index}-${item.title}`} tabIndex={0}>
                <div className="why-tilt"><div className="why-glare" aria-hidden="true" /><div className="why-card-content">
                  <span className="why-icon-tile"><WhyIcon index={index % 7} /></span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  {index === 0 && (
                    <div className="why-chips" aria-label="Civil, Electrical and Water services">
                      <span className="why-chip"><i className="why-chip-dot why-chip-dot--civil" />Civil</span>
                      <span className="why-chip"><i className="why-chip-dot why-chip-dot--electrical" />Electrical</span>
                      <span className="why-chip"><i className="why-chip-dot why-chip-dot--water" />Water</span>
                    </div>
                  )}
                </div></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {serve && (
      <section className="section who-serve-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Who We Serve</span>
            <h2>{serve.heading}</h2>
          </div>
          <ul className="check-list">
            {serveItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </section>
      )}

      {how && (
      <section className="how-we-work-section process" aria-labelledby="process-title">
        <div className="process-bg" aria-hidden="true" />
        <div className="process-inner">
          <header className="process-heading">
            <span className="process-eyebrow">How We Work</span>
            <h2 id="process-title" aria-label={how.heading}>
              {howWords.map((word, wordIndex) => (
                <Fragment key={`${wordIndex}-${word}`}>
                  {wordIndex > 0 && ' '}
                  <span className="process-word-mask"><span className="process-word">{word}</span></span>
                </Fragment>
              ))}
            </h2>
          </header>

          <div className="process-progress">
            <span className="process-progress-label" aria-live="polite">
              {activeStep && stepList[activeStep - 1] ? `Step ${activeStep}: ${stepList[activeStep - 1].title}` : 'Click a step to see how it works'}
            </span>
            <span className="process-progress-count">{activeStep || 0} / {stepList.length}</span>
            <div
              className="process-progress-track"
              role="progressbar"
              aria-label="Process progress"
              aria-valuemin={0}
              aria-valuemax={stepList.length}
              aria-valuenow={activeStep || 0}
            >
              <span className="process-progress-fill" style={{ transform: `scaleX(${(activeStep || 0) / (stepList.length || 1)})` }} />
            </div>
          </div>
          <div className="process-grid">
            {stepList.map((step) => (
              <article
                className={`process-card${activeStep === step.number ? ' is-open' : ''}${activeStep > step.number ? ' is-done' : ''}`}
                key={`${step.number}-${step.title}`}
                role="button"
                tabIndex={0}
                aria-expanded={activeStep === step.number}
                aria-controls={`process-detail-${step.number}`}
                onClick={() => setActiveStep(activeStep === step.number ? null : step.number)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveStep(activeStep === step.number ? null : step.number);
                  }
                }}
              >
                <span className="process-number">
                  <span className="process-number-text">{String(step.number).padStart(2, '0')}</span>
                  <svg className="process-number-check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.5 4.5L19 7" /></svg>
                </span>
                <h3>{step.title}</h3>
                <p>{step.summary}</p>
                <div className="process-more" id={`process-detail-${step.number}`} aria-hidden={activeStep !== step.number}>
                  <div className="process-more-inner">
                    <ProcessArt step={step.number} />
                    <p className="process-detail-copy">{step.detail}</p>
                  </div>
                </div>
                <span className="process-hint"><i />Tap to see how</span>
              </article>
            ))}
          </div>
        </div>
      </section>
      )}

      {shown('Leadership') && <LeadershipFeature />}
      {shown('Company Numbers') && <CompanyNumbers />}
      {shown('Clients') && <Clients />}
      {shown('FAQs') && <FAQ />}

      {cta && (
      <section className="section section-sand">
        <div className="container">
          <div className="cta-band">
            <h2>{cta.heading}</h2>
            {cta.body && <p>{cta.body}</p>}
            {cta.b1t && (
              <div className="cta-actions">
                <Link to={cta.b1l || '/contact'} className="btn btn-light"><span>{cta.b1t}</span></Link>
              </div>
            )}
          </div>
        </div>
      </section>
      )}
    </main>
  );
}