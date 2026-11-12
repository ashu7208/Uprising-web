import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <img src="/assets/logo-icon.jpg" alt="" className="brand-mark" />
              <span className="brand-text">UPRISING<br />INFRA LLP</span>
            </Link>
            <p>Uprising Infra LLP – Civil Construction | Electrical | Water Treatment</p>
          </div>

          <div className="footer-col">
            <h5>Quick Links</h5>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/#faqs">FAQs</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="footer-col">
            <h5>Contact</h5>
            <a href="mailto:uprisingmumbai@gmail.com">uprisingmumbai@gmail.com</a>
            <a href="tel:7977753070">Phone / WhatsApp: 7977753070</a>
            <span>
              Registered Office: Mahavir Platinum CHS, A/Wing, 704/7, Ghatkopar-Mankhurd
              Link Road, Indian Oil Nagar, Chembur, Mumbai, Maharashtra – 400043
            </span>
          </div>

          <div className="footer-col">
            <h5>Company Details</h5>
            <span>GST No.: 27AAGFU3924K1ZU</span>
            <span>LLPIN: AAS-6610</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Uprising Infra LLP. All rights reserved.</span>
          <div className="c">
            Designed &amp; Developed by <a href="https://TANASH-TECH-WEBSITE-URL" target="_blank" rel="noopener">Tanash Tech</a>
          </div>
          <span>GST No.: 27AAGFU3924K1ZU | LLPIN: AAS-6610</span>
        </div>
      </div>
    </footer>
  );
}
