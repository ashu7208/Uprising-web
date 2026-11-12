import { useState } from 'react';
import { submitContactRequest } from '../services/contactService';

export default function ContactForm() {
  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) {
      setStatus({ type: 'error', message: 'Enter a valid phone number with 10 to 15 digits.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Sending your request…' });
    try {
      await submitContactRequest(values);
      setStatus({ type: 'success', message: 'Your request has been sent.' });
      setValues({ name: '', phone: '', email: '', service: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error
          ? error.message
          : 'We could not send your request. Please contact us by phone or email.'
      });
    }
  };

  return (
    <div className="form-card rv r" style={{ '--d': '.2s' }}>
      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" value={values.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-phone">Phone</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={values.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="contact-service">Service Required</label>
          <select id="contact-service" name="service" value={values.service} onChange={handleChange} required>
            <option value="" disabled>Select a service</option>
            <option value="Civil">Civil</option>
            <option value="Electrical">Electrical</option>
            <option value="Water Treatment">Water Treatment</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows="5" value={values.message} onChange={handleChange} required />
        </div>
        {status.message && (
          <p className={`form-feedback form-feedback--${status.type}`} role={status.type === 'error' ? 'alert' : 'status'} aria-live="polite">
            {status.message}
          </p>
        )}
        <button type="submit" className="btn btn-primary" disabled={status.type === 'loading'} style={{ width: '100%', justifyContent: 'center' }}>
          <span>{status.type === 'loading' ? 'Sending…' : 'Submit'}</span>
        </button>
      </form>
    </div>
  );
}
