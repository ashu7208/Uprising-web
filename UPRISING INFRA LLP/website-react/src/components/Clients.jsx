import { useSiteContent } from '../services/siteContent';

const clientNames = [
  ['Har Ghar Jal', 'logo-name--jal'],
  ['Youtility', 'logo-name--youtility'],
  ['MP PHED', 'logo-name--phed'],
  ['MahaTransco', 'logo-name--transco'],
  ['Samudra', 'logo-name--samudra']
];

const clientLogos = [
  { src: '/images/clients/smart-infrastructure.webp', alt: 'Smart Infrastructure' },
  { src: '/images/clients/hem-utilities.webp', alt: 'HEM Utilities' },
  { src: '/images/clients/uprising-infra.webp', alt: 'Uprising Infra LLP' },
  { src: '/images/clients/tanash-tech.webp', alt: 'Tanash Tech' }
];

const clientItems = [
  ...clientNames.map(([name, className]) => ({ name, className })),
  ...clientLogos
];

export default function Clients() {
  const site = useSiteContent();
  const backendClients = Array.isArray(site?.clients)
    ? site.clients
      .filter((client) => typeof client?.name === 'string' && client.name.trim())
      .map((client) => {
        const name = client.name.trim();
        const matchingName = clientNames.find(
          ([builtInName]) => builtInName.trim().toLowerCase() === name.toLowerCase()
        );
        const matchingLogo = clientLogos.find(
          ({ alt }) => alt.trim().toLowerCase() === name.toLowerCase()
        );

        return {
          id: client.id,
          name,
          className: matchingName?.[1] || '',
          src: typeof client.logo === 'string' && client.logo.trim() ? client.logo : matchingLogo?.src,
          alt: matchingLogo?.alt || name,
          url: typeof client.url === 'string' && /^https?:\/\//i.test(client.url) ? client.url : ''
        };
      })
    : [];
  const clients = site && backendClients.length ? backendClients : clientItems;
  const renderClient = (item, set) => {
    const content = item.src
      ? <img src={item.src} alt={set === 0 ? item.alt : ''} />
      : <span className={`logo-name ${item.className}`}>
          {item.name}{item.name.toLowerCase() === 'samudra' && <small>LED Lighting</small>}
        </span>;

    return item.url ? <a href={item.url}>{content}</a> : content;
  };

  return (
    <section className="clients" aria-labelledby="clients-title">
      <div className="container">
        <div className="eyebrow">Our clients</div>
        <h2 id="clients-title">Awesome clients</h2>
        <p className="sub">We are associated with</p>
        <div className="lanes">
          {[false, true].map((reverse) => (
            <div className={`lane${reverse ? ' rev' : ''}`} key={String(reverse)}>
              <ul className={`track${reverse ? ' track--reverse' : ''}`} aria-label={reverse ? 'Client logos, reversed' : undefined}>
                {[0, 1].flatMap((set) => (reverse ? [...clients].reverse() : clients).map((item, index) => (
                  <li className="logo" key={`${item.id ?? `${index}-${item.name || item.alt}`}-${set}`} aria-hidden={set === 1}>
                    {renderClient(item, set)}
                  </li>
                )))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
