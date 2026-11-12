import ContactForm from '../components/ContactForm';
import ContactHero from '../components/ContactHero';

export default function Contact() {
  return (
    <main id="main">
      <ContactHero />

      <section className="section contact">
        <div className="container contact-wrap">
          <div>
            <div className="office-card rv l" style={{ '--d': '0s' }}>
              <div><h3>Registered Office</h3><p>Mahavir Platinum CHS, A/Wing, 704/7, Ghatkopar-Mankhurd Link Road, Indian Oil Nagar, Chembur, Mumbai, Maharashtra – 400043</p></div>
            </div>
            <div className="office-card rv l" style={{ '--d': '.15s' }}>
              <div><h3>Work Site / Fabrication Unit</h3><p>Plot No. 52, MM Fabrication, Jeejabai Bhosale Marg, Bhim Nagar, Govandi East, Mumbai, Maharashtra – 400043</p></div>
            </div>
            <div className="contact-details-panel rv" style={{ '--d': '.3s' }}>
              <div className="contact-row"><div><span className="lbl">Email</span><a href="mailto:uprisingmumbai@gmail.com">uprisingmumbai@gmail.com</a></div></div>
              <div className="contact-row"><div><span className="lbl">Phone</span><span className="val">7977753070</span></div></div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="find-us-section" aria-labelledby="find-us-heading">
        <div className="container">
          <div className="find-us-reveal">
            <div className="find-us-intro">
              <span className="find-us-eyebrow">Find Us</span>
              <h2 id="find-us-heading">Visit our registered office in Chembur</h2>
              <p>Mahavir Platinum CHS, A/Wing, 704/7, Ghatkopar-Mankhurd Link Road, Indian Oil Nagar, Chembur, Mumbai, Maharashtra – 400043</p>
            </div>
            <div className="find-us-map" aria-label="Map showing the Uprising Infra LLP registered office">
              <iframe
                title="Uprising Infra LLP registered office location"
                src="https://www.google.com/maps?q=Mahavir%20Platinum%20CHS%2C%20Ghatkopar-Mankhurd%20Link%20Road%2C%20Indian%20Oil%20Nagar%2C%20Chembur%2C%20Mumbai%20400043&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="find-us-caption">Uprising Infra LLP registered office location map (Google Maps)</p>
          </div>
        </div>
      </section>
    </main>
  );
}
