import { SF } from '../../data/config';
import { lines } from '../../lib/format';
import { can } from '../../lib/permissions';
import Modal from '../ui/Modal';
import DynamicForm from '../forms/DynamicForm';

export default function SectionEditModal({ module, name, value, onChange, onClose, onPreview, onSaveDraft, onPublish, role }) {
  const canPublish = can(role, module, 'publish');
  return <Modal title={`${name} (${module})`} onClose={onClose} wide>
    <DynamicForm fields={SF} value={value} onChange={onChange} />
    <div className="r"><button className="b2" onClick={onClose}>Close</button><button className="b2" onClick={onPreview}>Preview</button><button className="b2" onClick={onSaveDraft}>Save draft</button>
      <button className="b" disabled={!canPublish} title={!canPublish ? 'Editors cannot publish' : undefined} onClick={onPublish}>Publish</button></div>
  </Modal>;
}

export function DraftPreviewModal({ value, onClose }) {
  return <Modal title="Preview (draft)" onClose={onClose}>
    <div className="pv"><span className="sm mut">{value.subtitle}</span><h4>{value.heading}</h4><p>{value.body}</p>{lines(value.items).map((item) => <p className="sm" key={item}>• {item}</p>)}{value.b1t && <p><span className="pill">{value.b1t} → {value.b1l}</span></p>}</div>
    <div className="r"><button className="b2" onClick={onClose}>Close</button></div>
  </Modal>;
}
