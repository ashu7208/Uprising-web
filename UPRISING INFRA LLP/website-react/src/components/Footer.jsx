import { Link } from 'react-router-dom';
import { useSiteContent } from '../services/siteContent';

const footerDefaults = {
  email: 'uprisingmumbai@gmail.com',
  phone: '7977753070',
  office: 'Mahavir Platinum CHS, A/Wing, 704/7, Ghatkopar-Mankhurd Link Road, Indian Oil Nagar, Chembur, Mumbai, Maharashtra – 400043',
  gst: '27AAGFU3924K1ZU',
  llpin: 'AAS-6610',
  footer: 'Uprising Infra LLP – Civil Construction | Electrical | Water Treatment',
  copy: '© 2026 Uprising Infra LLP. All rights reserved.',
};

const defaultLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'FAQs', to: '/#faqs' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const site = useSiteContent();
  const fromSite = Object.fromEntries(
    Object.entries(site?.settings || {}).filter(([, v]) => String(v ?? '').trim())
  );
  const settings = { ...footerDefaults, ...fromSite };
  const quickLinks = site?.nav?.length
    ? site.nav.filter((item) => item.label?.trim()).map(({ label, link }) => ({ label, to: link || '/' }))
    : defaultLinks;
  const companyDetails = [
    settings.gst?.trim() && `GST No.: ${settings.gst}`,
    settings.llpin?.trim() && `LLPIN: ${settings.llpin}`,
  ].filter(Boolean).join(' | ');

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src="/assets/logo-icon.jpg" alt="" className="brand-mark" />
              <span className="brand-text">UPRISING<br />INFRA LLP</span>
            </Link>
            {settings.footer?.trim() && <p>{settings.footer}</p>}
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            {quickLinks.map(({ label, to }) => <Link key={`${label}-${to}`} to={to}>{label}</Link>)}
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            {settings.email?.trim() && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
            {settings.phone?.trim() && <a href={`tel:${String(settings.phone).replace(/[^\d+]/g, '')}`}>Phone / WhatsApp: {settings.phone}</a>}
            {settings.office?.trim() && <span>Registered Office: {settings.office}</span>}
          </div>

          <div className="footer-col">
            <h5>Company Details</h5>
            {settings.gst?.trim() && <span>GST No.: {settings.gst}</span>}
            {settings.llpin?.trim() && <span>LLPIN: {settings.llpin}</span>}
          </div>
        </div>

        <div className="footer-bottom">
          {settings.copy?.trim() && <span>{settings.copy}</span>}
          <div className="c">
            Designed &amp; Developed by <a href="https://TANASH-TECH-WEBSITE-URL" target="_blank" rel="noopener">Tanash Tech</a>
          </div>
          {companyDetails && <span>{companyDetails}</span>}
        </div>
      </div>
    </footer>
  );
}
