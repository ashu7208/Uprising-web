import Modal from '../ui/Modal';
import DynamicForm from './DynamicForm';

export default function SimulateEnquiryModal({ fields, value, onChange, onClose, onSubmit }) {
  return <Modal title="Simulate public contact form" onClose={onClose}>
    <p className="mut sm">This is what the website’s contact form does: it saves an enquiry that persists after a refresh.</p>
    <DynamicForm fields={fields} value={value} onChange={onChange} />
    <div className="r"><button className="b2" onClick={onClose}>Cancel</button><button className="b" onClick={onSubmit}>Submit enquiry</button></div>
  </Modal>;
}
