import Modal from '../ui/Modal';
import DynamicForm from '../forms/DynamicForm';

export default function RecordModal({ title, fields, value, onChange, onClose, onSave, disabled }) {
  return <Modal title={title} onClose={onClose}>
    <DynamicForm fields={fields} value={value} onChange={onChange} />
    <div className="r"><button className="b2" onClick={onClose}>Cancel</button><button className="b" disabled={disabled} onClick={onSave}>Save</button></div>
  </Modal>;
}
