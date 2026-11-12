import Modal from './Modal';

export default function ConfirmDialog({ message, onCancel, onConfirm }) {
  return <Modal title="Please confirm" onClose={onCancel}>
    <p>{message}</p>
    <div className="r"><button className="b2" onClick={onCancel}>Cancel</button><button className="bd" onClick={onConfirm}>Yes, continue</button></div>
  </Modal>;
}
