import { now } from '../lib/format';

const daysAgo = (days) => new Date(Date.now() - days * 864e5).toISOString();
const section = (name, heading, body = '', items = '', extra = {}) => {
  const data = { heading, subtitle: '', body, image: '', b1t: '', b1l: '', b2t: '', b2l: '', items, ...extra };
  return { name, enabled: true, live: { ...data }, draft: { ...data }, by: 'Seed', at: now() };
};

export function seed() {
  let id = 1;
  const records = (items) => items.map((record) => ({ id: id++, status: 'published', ...record }));
  const state = {
    nid: 1000,
    home: records([
      section('Hero', 'Building Strong Foundations. Powering Progress. Purifying Tomorrow.', 'Uprising Infra LLP delivers reliable civil construction, electrical and water treatment solutions across Mumbai with quality workmanship, safety and on-time delivery.', '', { subtitle: 'CIVIL CONSTRUCTION | ELECTRICAL | WATER TREATMENT', b1t: 'Get a Free Quote', b1l: '/contact', b2t: 'Our Services', b2l: '/services' }),
      section('Who We Are', 'Built on honesty, quality and long-term relationships.', 'Uprising Infra LLP is a registered Limited Liability Partnership based in Mumbai, Maharashtra. We specialise in civil construction, electrical works and water treatment systems.', 'Civil Construction | Buildings, RCC works, repairs, waterproofing and finishing.\nElectrical Works | Wiring, panels, earthing, lighting and maintenance (AMC).\nWater Treatment | STP, ETP and WTP plants, RO systems and upkeep.'),
      section('Why Choose Us', 'One reliable team, from planning to support', '', 'Three Services, One Partner | Civil, electrical and water treatment under one roof.\nQuality Materials and Workmanship | We use trusted materials and follow proper standards.\nSkilled Team | Experienced engineers, supervisors and technicians.\nOn-Time Delivery | Clear schedules and regular progress updates.\nTransparent Pricing | Detailed quotations with no hidden costs.\nSafety First | Safe working practices on every site.\nAfter-Work Support | We stand by our work even after handover.'),
      section('Who We Serve', 'Infrastructure solutions for every type of client', '', 'Housing societies and apartment complexes\nBuilders and developers\nIndustrial units and factories\nCommercial buildings and offices\nSchools, hospitals and institutions\nIndividual property owners'),
      section('How We Work', 'A clear process from enquiry to support', '', 'Enquiry and Site Visit | You contact us and we visit your site.\nPlanning and Quotation | We prepare a detailed scope, timeline and cost.\nApproval and Agreement | Work begins after your confirmation.\nExecution | Our team completes the work with regular supervision.\nQuality Check and Handover | Final inspection and clean handover.\nSupport | Maintenance and service whenever you need us.'),
      section('Leadership', 'Led by a hands-on construction leader.', 'Managed in the Leadership module.'),
      section('Company Numbers', 'Built on real work and client relationships', '', '20 | Projects Completed\n20 | Satisfied Clients\n6+ | Years of Experience\n3 | Core Services'),
      section('Clients', 'Awesome clients', 'We are associated with (logos come from the Clients module).'),
      section('FAQs', 'Frequently asked questions', 'Questions come from the FAQs module.'),
      section('Final CTA', 'Ready to start your project?', 'Talk to Uprising Infra LLP today and get a free site visit and quotation.', '', { b1t: 'Contact Us Now', b1l: '/contact' }),
    ]),
    about: records([
      section('About Hero', 'Infrastructure solutions built on trust and commitment', 'Uprising Infra LLP is a Mumbai-based company working across civil construction, electrical works and water treatment systems.'),
      section('Company Introduction', 'Uprising Infra LLP', 'Uprising Infra LLP is a registered Limited Liability Partnership based in Mumbai, Maharashtra. Our name reflects our belief: every project is a step towards growth, and every client relationship should rise with it.'),
      section('Mission', 'Deliver safe, durable and cost-effective infrastructure solutions.', 'To deliver safe, durable and cost-effective infrastructure solutions that exceed client expectations, while maintaining honesty, quality and timely completion.'),
      section('Vision', 'Be one of Mumbai’s most trusted infrastructure companies.', "To become one of Mumbai's most trusted infrastructure companies, known for integrity, innovation and long-term client relationships."),
      section('Company Values', 'What guides every project we take on.', '', 'Integrity | We say what we do and do what we say.\nQuality | We never compromise on materials or workmanship.\nSafety | The wellbeing of our people and clients comes first.\nCommitment | We respect deadlines and budgets.\nSustainability | We promote water conservation and efficient energy use.'),
      section('Leadership', 'Led by a hands-on construction leader.', 'Managed in the Leadership module.'),
      section('Company Details', 'Transparent, accountable and committed to long-term trust.', '', 'Company Name | Uprising Infra LLP\nLLPIN | AAS-6610\nGST No. | 27AAGFU3924K1ZU\nEmail | uprisingmumbai@gmail.com'),
      section('Final CTA', 'Need an infrastructure solution?', 'Contact Uprising Infra LLP for a free site visit and quotation.', '', { b1t: 'Get a Free Quote', b1l: '/contact' }),
    ]),
    services: records([
      { title: 'Civil Construction', short: 'Strong, long-lasting civil works for new structures, repair and renovation.', detail: 'Residential and commercial building construction, industrial sheds, RCC works, structural repairs, waterproofing, roads, drainage and finishing.', image: '', icon: 'building', features: 'Buildings and RCC works\nStructural repair\nWaterproofing and leakage solutions\nRoads, drainage and finishing', benefits: 'Durable construction\nOn-time delivery' },
      { title: 'Electrical Works', short: 'Safe, compliant and efficient electrical solutions for every property.', detail: 'Wiring, LT/HT panels, cable laying, earthing, lighting and annual maintenance.', image: '', icon: 'bolt', features: 'Wiring and cable laying\nPanels and distribution boards\nEarthing and lighting\nAMC and fault finding', benefits: 'Safe installations\nEnergy-saving lighting' },
      { title: 'Water Treatment', short: 'Clean water and responsible wastewater management.', detail: 'STP, ETP and WTP plants, RO systems, rainwater harvesting, pumps and operation and maintenance.', image: '', icon: 'drop', features: 'STP, ETP and WTP plants\nRO plants and softeners\nRainwater harvesting\nOperation and maintenance', benefits: 'Reliable water quality\nCompliance support' },
      { title: 'Annual Maintenance Contracts', short: 'AMC packages for electrical systems, STP and water plants.', detail: 'We offer AMC packages for electrical systems, STP and water plants, so your infrastructure keeps working smoothly all year.', image: '', icon: 'wrench', features: 'Electrical AMC\nSTP and water plant AMC', benefits: 'Year-round reliability' },
    ]),
    projects: records([
      { title: '[Project Name 1]', category: 'Civil', client: '', location: '[Location]', desc: 'Civil / Society repair', image: '', completed: '[Year]', pstatus: 'Completed', featured: false },
      { title: '[Project Name 2]', category: 'Electrical', client: '', location: '[Location]', desc: 'Electrical installation', image: '', completed: '[Year]', pstatus: 'Completed', featured: false },
      { title: '[Project Name 3]', category: 'Water Treatment', client: '', location: '[Location]', desc: 'STP / Water treatment', image: '', completed: '[Year]', pstatus: 'Completed', featured: false },
    ]),
    clients: records(['Har Ghar Jal (Jal Jeevan Mission)', 'Youtility Solutions Private Limited', 'MP PHED', 'MAHATRANSCO', 'Samudra LED Lighting', 'Smart Infrastructure Pvt. Ltd.', 'HEM Utilities', 'Tanash Tech Pvt. Ltd.'].map((name) => ({ name, logo: '', url: '', desc: '' }))),
    leadership: records([{ name: 'Ajay Shivnath Vishwakarma', role: 'CEO & Designated Partner', photo: '', bio: 'Ajay Shivnath Vishwakarma has led Uprising Infra LLP since its early operations. He oversees civil construction, electrical and water treatment projects from planning through execution.', exp: 'Designated Partner since 20 July 2020', links: '' }]),
    faqs: records([
      ['Which areas do you serve?', 'We primarily serve Mumbai, Navi Mumbai and surrounding regions. For larger projects, we can discuss other locations.'],
      ['Do you provide free quotations?', 'Yes. Contact us for a site visit and a detailed quotation.'],
      ['Can you handle civil, electrical and water works together?', 'Yes. That is our strength. One team can manage all three, saving you time and coordination effort.'],
      ['Do you offer maintenance contracts?', 'Yes. We provide AMC for electrical systems, STP, ETP and water treatment plants.'],
      ['Are you a registered company?', 'Yes. Uprising Infra LLP is a registered LLP with GST registration.'],
    ].map(([q, a]) => ({ q, a }))),
    nav: records([['Home', '/'], ['About', '/about'], ['Services', '/services'], ['Projects', '/projects'], ['FAQs', '/#faqs'], ['Contact', '/contact']].map(([label, link]) => ({ label, link, status: 'visible' }))),
    seo: records([['Home', 'Uprising Infra LLP | Civil Construction, Electrical & Water Treatment in Mumbai'], ['About', 'About Us | Uprising Infra LLP'], ['Services', 'Services | Uprising Infra LLP'], ['Projects', 'Projects | Uprising Infra LLP'], ['Contact', 'Contact Us | Uprising Infra LLP']].map(([page, title]) => ({ page, title, desc: '', keywords: 'civil contractor Mumbai, electrical contractor Mumbai, water treatment plant Mumbai', canon: '', ogt: '', ogd: '', ogi: '', robots: 'index, follow' }))),
    users: records([
      { name: 'Super Admin', email: 'admin@uprisinginfra.local', role: 'Super Admin', password: 'Admin@123', status: 'active' },
      { name: 'Site Manager', email: 'manager@uprisinginfra.local', role: 'Admin', password: 'Manager@123', status: 'active' },
      { name: 'Content Editor', email: 'editor@uprisinginfra.local', role: 'Editor', password: 'Editor@123', status: 'active' },
    ]),
    enquiries: [
      ['Demo Customer A', '9800000001', 'a@example.com', 'Civil', 'Need waterproofing quote for our society.', 'New', 2],
      ['Demo Customer B', '9800000002', 'b@example.com', 'Electrical', 'Panel upgrade enquiry.', 'Contacted', 12],
      ['Demo Customer C', '9800000003', 'c@example.com', 'Water Treatment', 'STP maintenance contract.', 'In Progress', 35],
      ['Demo Customer D', '9800000004', 'd@example.com', 'Civil', 'Building repair.', 'Converted', 62],
      ['Demo Customer E', '9800000005', 'e@example.com', 'Other', 'General query.', 'Closed', 95],
    ].map(([name, phone, email, service, message, status, days], index) => ({ id: 500 + index, name, phone, email, service, message, status, at: daysAgo(days), notes: [], follow: '' })),
    media: [], logs: [], backups: [],
    settings: {
      company: 'Uprising Infra LLP', email: 'uprisingmumbai@gmail.com', phone: '7977753070', whatsapp: '7977753070',
      office: 'Mahavir Platinum CHS, A/Wing, 704/7, Ghatkopar-Mankhurd Link Road, Indian Oil Nagar, Chembur, Mumbai, Maharashtra – 400043',
      site: 'Plot No. 52, MM Fabrication, Jeejabai Bhosale Marg, Bhim Nagar, Govandi East, Mumbai, Maharashtra – 400043',
      maps: '', facebook: '', instagram: '', linkedin: '', timings: 'Mon–Sat, 9:30 AM – 6:30 PM',
      gst: '27AAGFU3924K1ZU', llpin: 'AAS-6610', maint: false, cta: 'Get a Quote',
      footer: 'Uprising Infra LLP – Civil Construction | Electrical | Water Treatment',
      copy: '© 2026 Uprising Infra LLP. All rights reserved.',
    },
  };
  state.nid = 2000;
  return state;
}
