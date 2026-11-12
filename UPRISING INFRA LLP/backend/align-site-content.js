const pool = require('./db');

const updates = {
  'Who We Are': {
    heading: 'A trusted partner for construction, power and water',
    body: 'Uprising Infra LLP is a Mumbai-based infrastructure company providing end-to-end solutions in civil construction, electrical installation and water treatment. We work with housing societies, builders, industries, institutions and commercial clients who need dependable execution, transparent pricing and quality that lasts.\n\nWith one trusted team handling construction, power and water systems, you save time, avoid coordination problems and get a single point of responsibility for your project.',
    items: [
      'One Company. Complete Infrastructure Solutions. | Civil, electrical and water treatment under one roof, with a single point of responsibility.',
      'Civil Construction | Buildings, RCC and structural repair, waterproofing, roads and finishing.',
      'Electrical Works | Wiring, panels, cable laying, earthing, lighting and AMC.',
      'Water Treatment | STP, ETP and WTP plants, RO systems, and operation and maintenance.',
    ].join('\n'),
  },
  'How We Work': {
    items: [
      'Enquiry and Site Visit | You contact us and we visit your site. | Call, WhatsApp or email us. We visit your site, understand the scope and take measurements.',
      'Planning and Quotation | We prepare a detailed scope, timeline and cost. | You receive a detailed scope, timeline and itemised cost, with no hidden charges.',
      'Approval and Agreement | Work begins after your confirmation. | Review the quotation, confirm and sign. Work is scheduled only after your approval.',
      'Execution | Our team completes the work with regular supervision. | Our engineers and technicians carry out the work, with regular supervision and updates.',
      'Quality Check and Handover | Final inspection and clean handover. | We inspect every detail, fix snags and hand over a clean, ready-to-use site.',
      'Support | Maintenance and service whenever you need us. | Maintenance and service contracts, with quick response whenever you need us.',
    ].join('\n'),
  },
};

async function main() {
  const { rows } = await pool.query("SELECT data FROM content WHERE collection = 'home'");
  const home = rows[0].data;
  for (const section of home) {
    const patch = updates[section.name];
    if (!patch) continue;
    Object.assign(section.live, patch);
    Object.assign(section.draft, patch);
  }
  await pool.query("UPDATE content SET data = $1, updated_at = now() WHERE collection = 'home'", [JSON.stringify(home)]);
  console.log('Home content updated.');
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});