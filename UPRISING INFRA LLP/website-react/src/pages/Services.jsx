import { Link } from 'react-router-dom';
import { textLines, useSiteContent } from '../services/siteContent';

// detail, benefits, icon, and image are not backend-driven.
const DEFAULT_SERVICES = [
  {
    key: 'civil-construction',
    title: 'Civil Construction',
    short: 'From new structures to repair and renovation, we deliver strong and long-lasting civil works.',
    features: [
      'Residential and commercial building construction',
      'Industrial sheds and factory structures',
      'RCC works and structural repairs',
      'Structural and building repair for old societies',
      'Waterproofing and leakage solutions',
      'Plastering, painting and finishing works',
      'Flooring, tiling and paving',
      'Road, drainage and compound wall works',
      'Renovation and interior civil works',
      'Society maintenance and redevelopment-related works'
    ]
  },
  {
    key: 'electrical-works',
    title: 'Electrical Works',
    short: 'Safe, compliant and efficient electrical solutions for every type of property.',
    features: [
      'Complete electrical wiring for residential, commercial and industrial sites',
      'LT/HT panel installation and maintenance',
      'Distribution boards and cable laying',
      'Earthing and lightning protection',
      'Street lighting and outdoor lighting',
      'LED lighting and energy-saving solutions',
      'Generator and UPS connections',
      'Electrical load balancing and fault finding',
      'Annual maintenance contracts (AMC)',
      'Fire alarm and CCTV cabling support'
    ]
  },
  {
    key: 'water-treatment',
    title: 'Water Treatment',
    short: 'Clean water and responsible wastewater management for homes, societies and industries.',
    features: [
      'Sewage Treatment Plants (STP): installation, upgrade and maintenance',
      'Effluent Treatment Plants (ETP) for industries',
      'Water Treatment Plants (WTP) and filtration systems',
      'RO plants and softeners',
      'Rainwater harvesting systems',
      'Water tank cleaning and pipeline works',
      'Pumps, motors and plumbing installation',
      'Operation and maintenance (O&M) contracts',
      'Water testing and quality support'
    ]
  }
];

const nonEmpty = (value) => String(value ?? '').trim();

function readServicesContent(site) {
  if (!site) return DEFAULT_SERVICES;

  try {
    const backendServices = Array.isArray(site.services) ? site.services : [];

    return DEFAULT_SERVICES.map((defaultService) => {
      const categoryTitle = defaultService.title.toLowerCase();
      const exactMatch = backendServices.find((service) => (
        nonEmpty(service?.title).toLowerCase() === categoryTitle
      ));
      const backendService = exactMatch || backendServices.find((service) => {
        const title = nonEmpty(service?.title).toLowerCase();
        return title && (title.includes(categoryTitle) || categoryTitle.includes(title));
      });

      if (!backendService) return defaultService;

      const title = nonEmpty(backendService.title);
      const short = nonEmpty(backendService.short);
      const features = textLines(backendService.features);

      return {
        ...defaultService,
        title: title || defaultService.title,
        short: short || defaultService.short,
        features: features.length ? features : defaultService.features
      };
    });
  } catch (error) {
    console.error('Unable to parse Services page content:', error);
    return DEFAULT_SERVICES;
  }
}

const serviceHeadingWords = 'Civil construction, electrical works and water treatment'.split(' ');
const serviceLeadWords = 'Reliable infrastructure solutions for housing societies, industries and commercial projects.'.split(' ');
const serviceLeadDelay = 0.55 + serviceHeadingWords.length * 0.09 + 0.2;
const serviceIconDelay = `${serviceLeadDelay + serviceLeadWords.length * 0.035 + 0.3}s`;

export default function Services() {
  const site = useSiteContent();
  const services = readServicesContent(site);

  return (
    <main id="main">
      <section className="hero services-hero" id="hero">
        <div className="bg" aria-hidden="true" />
        <div className="veil" aria-hidden="true" />
        <div className="in">
          <div className="breadcrumb crumb"><Link to="/">Home</Link><span className="sep">/</span><span>Services</span></div>
          <span className="eyebrow">Our Services<i aria-hidden="true" /></span>
          <h1 id="h1" aria-label="Civil construction, electrical works and water treatment">
            {serviceHeadingWords.map((word, index) => (
              <span key={`${word}-${index}`}>
                {index > 0 ? ' ' : null}
                <span className="w" aria-hidden="true">
                  <span className="wi" style={{ '--i': index }}>{word}</span>
                </span>
              </span>
            ))}
          </h1>
          <p id="lead" aria-label="Reliable infrastructure solutions for housing societies, industries and commercial projects.">
            {serviceLeadWords.map((word, index) => (
              <span key={`${word}-${index}`}>
                {index > 0 ? ' ' : null}
                <span className="lw" aria-hidden="true" style={{ '--j': index, '--ld': `${serviceLeadDelay}s` }}>{word}</span>
              </span>
            ))}
          </p>
          <div className="icons" id="icons" role="list" aria-label="Our services">
            <div className="ic" style={{ '--k': 0, '--ib': serviceIconDelay }} role="listitem"><div className="c"><svg viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path pathLength="1" d="M10 29a14 14 0 0 1 28 0" /><path pathLength="1" d="M6 29h36v4H6z" /><path pathLength="1" d="M20 15v-3h8v3M24 12v8" /><path pathLength="1" d="M15 38h18" /></svg></div>Civil<br />Construction</div>
            <div className="dv" style={{ '--k': 0, '--ib': serviceIconDelay }} aria-hidden="true" />
            <div className="ic" style={{ '--k': 1, '--ib': serviceIconDelay }} role="listitem"><div className="c"><svg viewBox="0 0 48 48" fill="#fff" aria-hidden="true"><path className="bolt" d="M27 6 12 27h10l-3 15 17-23H26z" /></svg></div>Electrical<br />Works</div>
            <div className="dv" style={{ '--k': 1, '--ib': serviceIconDelay }} aria-hidden="true" />
            <div className="ic" style={{ '--k': 2, '--ib': serviceIconDelay }} role="listitem"><div className="c"><svg viewBox="0 0 48 48" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path pathLength="1" d="M24 7c6 8 10 13 10 18a10 10 0 0 1-20 0c0-5 4-10 10-18z" /><path pathLength="1" d="M12 38c3-2 5-2 8 0s5 2 8 0 5-2 8 0" /></svg></div>Water<br />Treatment</div>
          </div>
        </div>
      </section>

      <section className="section" id="civil-construction">
        <div className="civil-construction-bg" aria-hidden="true" />
        <div className="container">
          <div className="section-head"><span className="eyebrow">Service 01</span><h2>4.1 {services[0].title}</h2><p>{services[0].short}</p></div>
          <ul className="service-list">
            {services[0].features.map((item, index) => (
              <li className="civil-service-wrap" key={`${services[0].key}-${item}-${index}`}><div className="civil-service-card"><span>{item}</span></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-sand" id="electrical-works">
        <div className="electrical-works-bg" aria-hidden="true" />
        <div className="container">
          <div className="section-head"><span className="eyebrow">Service 02</span><h2>4.2 {services[1].title}</h2><p>{services[1].short}</p></div>
          <ul className="service-list">
            {services[1].features.map((item, index) => (
              <li className="electrical-service-wrap" key={`${services[1].key}-${item}-${index}`}><div className="electrical-service-card"><span>{item}</span></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="water-treatment">
        <div className="water-treatment-bg" aria-hidden="true" />
        <div className="container">
          <div className="section-head"><span className="eyebrow">Service 03</span><h2>4.3 {services[2].title}</h2><p>{services[2].short}</p></div>
          <ul className="service-list">
            {services[2].features.map((item, index) => (
              <li className="water-service-wrap" key={`${services[2].key}-${item}-${index}`}><div className="water-service-card"><span>{item}</span></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-sand">
        <div className="container">
          <div className="tile-card" style={{ cursor: 'default' }}>
            <h2>Annual Maintenance Contracts</h2>
            <p>We offer AMC packages for electrical systems, STP and water plants, so your infrastructure keeps working smoothly all year. Contact us for a customised plan.</p>
            <Link to="/contact" className="tile-link">Contact us for a customised plan</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-band">
            <h2>Need an infrastructure solution?</h2>
            <p>Contact Uprising Infra LLP for a free site visit and quotation.</p>
            <div className="cta-actions"><Link to="/contact" className="btn btn-light"><span>Get a Free Quote</span></Link></div>
          </div>
        </div>
      </section>
    </main>
  );
}
