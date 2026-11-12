import { fmt } from '../../lib/format';
import Modal from '../ui/Modal';

const STATUSES = ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'];

export default function EnquiryModal({ record, status, setStatus, follow, setFollow, note, setNote, onClose, onSave, disabled }) {
  return <Modal title={`${record.name} · ${record.status}`} onClose={onClose} wide>
    <p className="mut">{record.phone} · {record.email} · {record.service} · {fmt(record.at)}</p>
    <div className="pv"><p style={{ color: 'var(--ink)' }}>{record.message}</p></div>
    <div className="row2"><div className="fld"><label htmlFor="enquiry-status">Status</label><select id="enquiry-status" value={status} onChange={(event) => setStatus(event.target.value)}>{STATUSES.map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="fld"><label htmlFor="follow-date">Follow-up date</label><input id="follow-date" type="date" value={follow} onChange={(event) => setFollow(event.target.value)} /></div></div>
    <div className="fld"><label htmlFor="internal-note">Add internal note</label><textarea id="internal-note" value={note} onChange={(event) => setNote(event.target.value)} /></div>
    {record.notes.map((item, index) => <p className="sm" key={`${item.at}-${index}`}><b>{item.by}</b> · {fmt(item.at)}<br />{item.t}</p>)}
    <div className="r"><button className="b2" onClick={onClose}>Close</button><button className="b" disabled={disabled} onClick={onSave}>Save</button></div>
  </Modal>;
}
