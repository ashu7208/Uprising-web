import { Link } from 'react-router-dom';
import AnimatedCounter from './AnimatedCounter';
import { Fragment, useState } from 'react';
import { findSection, resolveMediaUrl, textLines, useSiteContent } from '../services/siteContent';

const DEFAULT_LEADERSHIP = {
  name: 'Ajay Shivnath Vishwakarma',
  role: 'CEO & Designated Partner',
  photo: '/assets/director-ajay.jpg',
  alt: 'Ajay Shivnath Vishwakarma, CEO and Designated Partner of Uprising Infra LLP',
  bio: "Ajay Shivnath Vishwakarma has led Uprising Infra LLP since its early operations. He oversees the firm's civil construction, electrical and water treatment projects from planning through execution, with hands-on involvement in site management, vendor coordination and quality control across residential, commercial and industrial work in Mumbai.",
  exp: 'Site Management\nVendor Coordination\nQuality Control\nPlanning to Execution'
};

const DEFAULT_HEADING = 'Led by a hands-on construction leader';
const DEFAULT_SUBTITLE = 'Designated Partner at Uprising Infra LLP since 20 July 2020';

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
  const site = useSiteContent();
  let heading = DEFAULT_HEADING;
  let subtitle = DEFAULT_SUBTITLE;
  try {
    const section = findSection(site?.home, 'Leadership');
    const backendHeading = String(section?.heading ?? '').trim();
    const backendSubtitle = String(section?.subtitle ?? '').trim();
    if (backendHeading) heading = backendHeading;
    if (backendSubtitle) subtitle = backendSubtitle;
  } catch {
    heading = DEFAULT_HEADING;
    subtitle = DEFAULT_SUBTITLE;
  }
  const headingWords = heading.split(/\s+/).filter(Boolean);

  let leadership = DEFAULT_LEADERSHIP;
  try {
    const person = Array.isArray(site?.leadership) ? site.leadership[0] : null;
    const name = String(person?.name ?? '').trim();
    if (name) {
      const role = String(person.role ?? '').trim();
      const bio = String(person.bio ?? '').trim();
      const exp = String(person.exp ?? '').trim();
      const photo = String(person.photo ?? '').trim();
      leadership = {
        name,
        role: role || DEFAULT_LEADERSHIP.role,
        photo: photo ? resolveMediaUrl(photo) || DEFAULT_LEADERSHIP.photo : DEFAULT_LEADERSHIP.photo,
        alt: `${name}, ${role || DEFAULT_LEADERSHIP.role} of Uprising Infra LLP`,
        bio: bio || DEFAULT_LEADERSHIP.bio,
        exp: exp || DEFAULT_LEADERSHIP.exp
      };
    }
  } catch {
    leadership = DEFAULT_LEADERSHIP;
  }
  const nameWords = leadership.name.split(/\s+/);
  const experienceLines = textLines(leadership.exp);

  return (
    <section className="leadership-section" aria-labelledby="leadership-title">
      <div className="leadership-inner">
        <header className="leadership-heading">
          <span className="leadership-eyebrow">Leadership</span>
          <h2 id="leadership-title" aria-label="Led by a hands-on construction leader">
            {headingWords.map((word, index) => (
              <Fragment key={`${index}-${word}`}>
                {index > 0 && ' '}
                <span className="leadership-word-mask"><span className="leadership-word">{word}</span></span>
              </Fragment>
            ))}
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
                  src={leadership.photo}
                  alt={leadership.alt}
                  className="leadership-photo"
                  onError={(event) => {
                    const image = event.currentTarget;
                    image.onerror = null;
                    image.src = DEFAULT_LEADERSHIP.photo;
                  }}
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
            <span className="leadership-role">{leadership.role}</span>
            <h3 aria-label={leadership.name}>
              {nameWords.map((word, index) => (
                <Fragment key={`${index}-${word}`}>
                  {index > 0 && ' '}
                  <span className="leadership-name-mask"><span className="leadership-name-word">{word}</span></span>
                </Fragment>
              ))}
            </h3>
            <p className="leadership-subtitle">{subtitle}</p>
            <p className="leadership-bio">
              {leadership.bio}
            </p>
            <ul className="leadership-chips" aria-label="Areas of leadership">
              {experienceLines.map((line, index) => <li key={`${index}-${line}`}>{line}</li>)}
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
