export const SF = [
  ['heading', 'Heading', 'text'], ['subtitle', 'Subtitle', 'text'], ['body', 'Description', 'textarea'],
  ['image', 'Background / section image', 'image'], ['b1t', 'Main button text', 'text'],
  ['b1l', 'Main button link', 'text'], ['b2t', 'Secondary button text', 'text'],
  ['b2l', 'Secondary button link', 'text'], ['items', 'Cards / items (one per line: Title | Description)', 'lines'],
];
export const ST = ['published', 'draft'];
export const ROLES = ['Super Admin', 'Admin', 'Editor'];
export const MENU = [
  ['dashboard', 'Dashboard', '▦'], ['site', 'Website Management', '◎'], ['home', 'Home Page', '⌂'],
  ['about', 'About Us', 'ⓘ'], ['services', 'Services', '⚙'], ['projects', 'Projects', '▣'],
  ['clients', 'Clients', '☰'], ['leadership', 'Leadership', '★'], ['faqs', 'FAQs', '?'],
  ['enquiries', 'Contact Management', '✉'], ['media', 'Media Library', '▨'],
  ['navfooter', 'Navigation & Footer', '≡'], ['seo', 'SEO Management', '⌕'],
  ['users', 'User Management', '☺'], ['logs', 'Activity Logs', '◷'], ['backup', 'Backup & Restore', '⟲'],
  ['settings', 'Website Settings', '✲'],
];
export const LISTS = {
  services: { t: 'Service', f: [['title', 'Service title', 'text'], ['short', 'Short description', 'textarea'], ['detail', 'Detailed description', 'textarea'], ['image', 'Hero image', 'image'], ['icon', 'Icon (building, bolt, drop, wrench…)', 'text'], ['features', 'Features (one per line)', 'lines'], ['benefits', 'Benefits (one per line)', 'lines'], ['status', 'Status', 'select', ST]], c: ['title', 'short'] },
  projects: { t: 'Project', f: [['title', 'Project title', 'text'], ['category', 'Category', 'select', ['Civil', 'Electrical', 'Water Treatment', 'Other']], ['client', 'Client name', 'text'], ['location', 'Location', 'text'], ['desc', 'Description', 'textarea'], ['image', 'Cover image', 'image'], ['completed', 'Completion date / year', 'text'], ['pstatus', 'Project status', 'select', ['Completed', 'Ongoing', 'Planned']], ['featured', 'Featured project', 'bool'], ['status', 'Status', 'select', ST]], c: ['title', 'category', 'location', 'pstatus'], flt: 'category' },
  clients: { t: 'Client', f: [['name', 'Client name', 'text'], ['logo', 'Logo', 'image'], ['url', 'Website URL', 'text'], ['desc', 'Description', 'textarea'], ['status', 'Status', 'select', ST]], c: ['name', 'url'] },
  leadership: { t: 'Leader', f: [['name', 'Name', 'text'], ['role', 'Designation', 'text'], ['photo', 'Profile picture', 'image'], ['bio', 'Biography', 'textarea'], ['exp', 'Experience', 'text'], ['links', 'Social links', 'text'], ['status', 'Status', 'select', ST]], c: ['name', 'role'] },
  faqs: { t: 'FAQ', f: [['q', 'Question', 'text'], ['a', 'Answer', 'textarea'], ['status', 'Status', 'select', ST]], c: ['q'] },
  nav: { t: 'Menu item', f: [['label', 'Label', 'text'], ['link', 'Link', 'text'], ['status', 'Visibility', 'select', ['visible', 'hidden']]], c: ['label', 'link'], mod: 'navfooter' },
  seo: { t: 'SEO page', f: [['title', 'SEO title', 'text'], ['desc', 'Meta description', 'textarea'], ['keywords', 'Meta keywords', 'text'], ['canon', 'Canonical URL', 'text'], ['ogt', 'Open Graph title', 'text'], ['ogd', 'Open Graph description', 'textarea'], ['ogi', 'Open Graph image', 'image'], ['robots', 'Robots', 'select', ['index, follow', 'noindex, follow', 'index, nofollow', 'noindex, nofollow']]], c: ['page', 'title', 'robots'], fixed: true },
  users: { t: 'User', f: [['name', 'Name', 'text'], ['email', 'Email', 'text'], ['role', 'Role', 'select', ROLES], ['password', 'Password (prototype only – hashed in production)', 'text'], ['status', 'Status', 'select', ['active', 'disabled']]], c: ['name', 'email', 'role'], mod: 'users' },
};
