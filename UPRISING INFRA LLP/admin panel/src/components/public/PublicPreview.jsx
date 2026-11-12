import { useStore } from '../../context/StoreContext';
import { lines } from '../../lib/format';

export default function PublicPreview() {
  const { state } = useStore();
  const settings = state.settings;
  if (settings.maint) return <div className="emp"><h2>We’ll be back soon</h2><p>The website is in maintenance mode.</p></div>;
  const visible = (item) => item?.enabled && item.live;
  const hero = state.home.find((item) => item.name === 'Hero');
  const renderSection = (section) => <div className="pv" key={section.id}><h4>{section.live.heading}</h4><p>{section.live.body}</p>{section.live.items && <p className="sm">{lines(section.live.items).slice(0, 4).join(' · ')}</p>}</div>;
  return <>
    <div className="pv"><b>{settings.company}</b> · {state.nav.filter((item) => item.status === 'visible').map((item) => item.label).join(' · ')} · <span style={{ color: 'var(--r)' }}>{settings.cta}</span></div>
    {visible(hero) && <div className="pv" style={{ background: '#fff7f5' }}><span className="sm mut">{hero.live.subtitle}</span><h4 style={{ fontSize: 20 }}>{hero.live.heading}</h4><p>{hero.live.body}</p></div>}
    {state.home.filter((item) => item.name !== 'Hero' && visible(item)).map(renderSection)}
    {state.about.filter(visible).map(renderSection)}
    <div className="pv"><h4>Services (published)</h4><p>{state.services.filter((item) => item.status === 'published').map((item) => item.title).join(' · ') || '—'}</p></div>
    <div className="pv"><h4>Projects (published)</h4><p>{state.projects.filter((item) => item.status === 'published').map((item) => item.title).join(' · ') || '—'}</p></div>
    <div className="pv"><h4>Clients</h4><p>{state.clients.filter((item) => item.status === 'published').map((item) => item.name).join(' · ') || '—'}</p></div>
    <div className="pv"><h4>FAQs</h4>{state.faqs.filter((item) => item.status === 'published').map((item) => <p key={item.id}><b>{item.q}</b> {item.a}</p>)}</div>
    <div className="pv"><b>Contact</b> · {settings.phone} · {settings.email}<br /><span className="sm mut">{settings.office}</span><br /><span className="sm mut">{settings.copy}</span></div>
  </>;
}
