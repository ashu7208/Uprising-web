import { useStore } from '../hooks/useStore';
import Badge from '../components/ui/Badge';
import { fmt } from '../lib/format';

export default function Dashboard() {
  const { state } = useStore();
  const enquiries = state.enquiries;
  const newCount = enquiries.filter((item) => item.status === 'New').length;
  const months = [];
  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setMonth(date.getMonth() - offset);
    months.push({ label: date.toLocaleString('en', { month: 'short' }), month: date.getMonth(), year: date.getFullYear(), count: 0 });
  }
  enquiries.forEach((item) => {
    const date = new Date(item.at);
    const month = months.find((entry) => entry.month === date.getMonth() && entry.year === date.getFullYear());
    if (month) month.count += 1;
  });
  const max = Math.max(1, ...months.map((month) => month.count));
  const sections = [...state.home, ...state.about];
  const sectionState = (record) => !record.live ? 'Unpublished' : JSON.stringify(record.live) !== JSON.stringify(record.draft) ? 'Draft changes' : 'Published';
  const kpis = [
    ['Total enquiries', enquiries.length], ['New enquiries', newCount], ['Contacted', enquiries.filter((item) => item.status === 'Contacted').length],
    ['Total projects', state.projects.length], ['Published projects', state.projects.filter((item) => item.status === 'published').length],
    ['Total clients', state.clients.length], ['Total services', state.services.length],
  ];
  return <>
    <div className="grid g4">{kpis.map(([label, count]) => <div className="card kpi" key={label}><b>{count}</b><span>{label}</span></div>)}</div>
    <div className="grid g2" style={{ marginTop: 16 }}>
      <div className="card"><h3 style={{ marginTop: 0 }}>Monthly enquiries</h3><div className="chart">{months.map((month) => <div key={`${month.year}-${month.month}`}><b>{month.count}</b><i style={{ height: `${Math.max(4, month.count / max * 110)}px` }} />{month.label}</div>)}</div></div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Website content status</h3>{['Published', 'Draft changes', 'Unpublished'].map((status) => <p key={status}><Badge>{status}</Badge> <b>{sections.filter((item) => sectionState(item) === status).length}</b> sections</p>)}<p className="mut sm">{sections.filter((item) => !item.enabled).length} sections are hidden from the public site.</p></div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Recent enquiries</h3>{enquiries.length ? enquiries.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 5).map((item) => <p key={item.id} style={{ margin: '6px 0' }}><b>{item.name}</b> <Badge>{item.status}</Badge><br /><span className="mut sm">{item.service} · {fmt(item.at)}</span></p>) : <div className="emp">No enquiries yet</div>}</div>
      <div className="card"><h3 style={{ marginTop: 0 }}>Recent activity</h3>{state.logs.slice(0, 6).map((item) => <p key={item.id} style={{ margin: '6px 0' }}><b>{item.user}</b> {item.action} <span className="mut">{item.mod}{item.rec ? ` · ${item.rec}` : ''}</span><br /><span className="mut sm">{fmt(item.at)}</span></p>)}{!state.logs.length && <div className="emp">No activity yet. Make a change and it shows here.</div>}</div>
    </div>
  </>;
}
