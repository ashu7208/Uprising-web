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
                {[0, 1].flatMap((set) => (reverse ? [...clientItems].reverse() : clientItems).map((item) => (
                  <li className="logo" key={`${item.name || item.alt}-${set}`} aria-hidden={set === 1}>
                    {item.src
                      ? <img src={item.src} alt={set === 0 ? item.alt : ''} />
                      : <span className={`logo-name ${item.className}`}>
                          {item.name}{item.name === 'Samudra' && <small>LED Lighting</small>}
                        </span>}
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
