import { Link } from 'react-router-dom';

const civilServiceList = [
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
];

const electricalServiceList = [
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
];

const waterServiceList = [
  'Sewage Treatment Plants (STP): installation, upgrade and maintenance',
  'Effluent Treatment Plants (ETP) for industries',
  'Water Treatment Plants (WTP) and filtration systems',
  'RO plants and softeners',
  'Rainwater harvesting systems',
  'Water tank cleaning and pipeline works',
  'Pumps, motors and plumbing installation',
  'Operation and maintenance (O&M) contracts',
  'Water testing and quality support'
];

const serviceHeadingWords = 'Civil construction, electrical works and water treatment'.split(' ');
const serviceLeadWords = 'Reliable infrastructure solutions for housing societies, industries and commercial projects.'.split(' ');
const serviceLeadDelay = 0.55 + serviceHeadingWords.length * 0.09 + 0.2;
const serviceIconDelay = `${serviceLeadDelay + serviceLeadWords.length * 0.035 + 0.3}s`;

export default function Services() {
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
          <div className="section-head"><span className="eyebrow">Service 01</span><h2>4.1 Civil Construction</h2><p>From new structures to repair and renovation, we deliver strong and long-lasting civil works.</p></div>
          <ul className="service-list">
            {civilServiceList.map((item) => (
              <li className="civil-service-wrap" key={item}><div className="civil-service-card"><span>{item}</span></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-sand" id="electrical-works">
        <div className="electrical-works-bg" aria-hidden="true" />
        <div className="container">
          <div className="section-head"><span className="eyebrow">Service 02</span><h2>4.2 Electrical Works</h2><p>Safe, compliant and efficient electrical solutions for every type of property.</p></div>
          <ul className="service-list">
            {electricalServiceList.map((item) => (
              <li className="electrical-service-wrap" key={item}><div className="electrical-service-card"><span>{item}</span></div></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="water-treatment">
        <div className="water-treatment-bg" aria-hidden="true" />
        <div className="container">
          <div className="section-head"><span className="eyebrow">Service 03</span><h2>4.3 Water Treatment</h2><p>Clean water and responsible wastewater management for homes, societies and industries.</p></div>
          <ul className="service-list">
            {waterServiceList.map((item) => (
              <li className="water-service-wrap" key={item}><div className="water-service-card"><span>{item}</span></div></li>
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
