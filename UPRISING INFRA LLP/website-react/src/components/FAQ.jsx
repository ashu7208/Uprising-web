import { useSiteContent } from '../services/siteContent';

const DEFAULT_FAQS = [
  {
    question: 'Which areas do you serve?',
    answer: 'We primarily serve Mumbai, Navi Mumbai and surrounding regions. For larger projects, we can discuss other locations.'
  },
  {
    question: 'Do you provide free quotations?',
    answer: 'Yes. Contact us for a site visit and a detailed quotation.'
  },
  {
    question: 'Can you handle civil, electrical and water works together?',
    answer: 'Yes. That is our strength. One team can manage all three, saving you time and coordination effort.'
  },
  {
    question: 'Do you offer maintenance contracts?',
    answer: 'Yes. We provide AMC for electrical systems, STP, ETP and water treatment plants.'
  },
  {
    question: 'Are you a registered company?',
    answer: 'Yes. Uprising Infra LLP is a registered LLP with GST registration.'
  }
];

export default function FAQ() {
  const site = useSiteContent();
  const backendFaqs = Array.isArray(site?.faqs)
    ? site.faqs
      .filter((faq) => typeof faq?.q === 'string' && faq.q.trim() && typeof faq?.a === 'string' && faq.a.trim())
      .map((faq) => ({ id: faq.id, question: faq.q, answer: faq.a }))
    : [];
  const faqs = backendFaqs.length ? backendFaqs : DEFAULT_FAQS;

  return (
    <section className="section" id="faqs">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">FAQs</span>
          <h2>Frequently asked questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.id ?? `${index}-${faq.question}`}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
