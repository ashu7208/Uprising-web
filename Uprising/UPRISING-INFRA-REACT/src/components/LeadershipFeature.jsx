import { Link } from 'react-router-dom';
import AnimatedCounter from './AnimatedCounter';
import { useState } from 'react';

const stats = [
  { target: 6, suffix: ' +', label: 'Years' },
  { target: 20, suffix: '', label: 'Projects' },
  { target: 3, suffix: '', label: 'Core Services' }
];

function LeadershipStat({ stat, index }) {
  const [replay, setReplay] = useState(0);

  return (
    <button
      className="leadership-stat"
      key={stat.label}
      type="button"
      aria-label={`${stat.target}${stat.suffix || ''} ${stat.label}. Replay count animation.`}
      onClick={() => setReplay((current) => current + 1)}
    >
      <strong className="leadership-stat-count">
        <AnimatedCounter {...stat} replay={replay} startDelay={3000 + index * 150} duration={1700} />
      </strong>
      <span>{stat.label}</span>
    </button>
  );
}

export default function LeadershipFeature() {
  return (
    <section className="leadership-section" aria-labelledby="leadership-title">
      <div className="leadership-inner">
        <header className="leadership-heading">
          <span className="leadership-eyebrow">Leadership</span>
          <h2 id="leadership-title" aria-label="Led by a hands-on construction leader">
            <span className="leadership-word-mask"><span className="leadership-word">Led</span></span>
            <span className="leadership-word-mask"><span className="leadership-word">by</span></span>
            <span className="leadership-word-mask"><span className="leadership-word">a</span></span>
            <span className="leadership-word-mask"><span className="leadership-word">hands-on</span></span>
            <span className="leadership-word-mask"><span className="leadership-word">construction</span></span>
            <span className="leadership-word-mask"><span className="leadership-word">leader</span></span>
          </h2>
        </header>

        <article className="leadership-card">
          <div className="leadership-card-glow" aria-hidden="true" />
          <div className="leadership-card-dots" aria-hidden="true" />
          <div className="leadership-card-sheen" aria-hidden="true" />
          <div className="leadership-photo-column">
            <div className="leadership-photo-frame">
              <div className="leadership-photo-tilt">
                <img
                  src="/assets/director-ajay.jpg"
                  alt="Ajay Shivnath Vishwakarma, CEO and Designated Partner of Uprising Infra LLP"
                  className="leadership-photo"
                />
                <span className="leadership-photo-glare" aria-hidden="true" />
              </div>
              <span className="leadership-corner leadership-corner--tl" aria-hidden="true" />
              <span className="leadership-corner leadership-corner--tr" aria-hidden="true" />
              <span className="leadership-corner leadership-corner--bl" aria-hidden="true" />
              <span className="leadership-corner leadership-corner--br" aria-hidden="true" />
              <span className="leadership-since">Since 20 July 2020</span>
            </div>
          </div>

          <div className="leadership-copy">
            <span className="leadership-role">CEO &amp; Designated Partner</span>
            <h3 aria-label="Ajay Shivnath Vishwakarma">
              <span className="leadership-name-mask"><span className="leadership-name-word">Ajay</span></span>
              <span className="leadership-name-mask"><span className="leadership-name-word">Shivnath</span></span>
              <span className="leadership-name-mask"><span className="leadership-name-word">Vishwakarma</span></span>
            </h3>
            <p className="leadership-subtitle">Designated Partner at Uprising Infra LLP since 20 July 2020</p>
            <p className="leadership-bio">
              Ajay Shivnath Vishwakarma has led Uprising Infra LLP since its early operations. He oversees the firm&apos;s civil construction, electrical and water treatment projects from planning through execution, with hands-on involvement in site management, vendor coordination and quality control across residential, commercial and industrial work in Mumbai.
            </p>
            <ul className="leadership-chips" aria-label="Areas of leadership">
              <li>Site Management</li>
              <li>Vendor Coordination</li>
              <li>Quality Control</li>
              <li>Planning to Execution</li>
            </ul>
            <div className="leadership-stats" aria-label="Leadership impact">
              {stats.map((stat, index) => (
                <LeadershipStat stat={stat} index={index} key={stat.label} />
              ))}
            </div>
            <div className="leadership-actions">
              <a className="leadership-button leadership-button--primary" href="mailto:uprisingmumbai@gmail.com">Get in Touch <span aria-hidden="true">→</span></a>
              <Link className="leadership-button leadership-button--outline" to="/services">Our Services</Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
