import { useEffect, useId, useRef } from 'react';
import { useUI } from '../../context/UIContext';

export default function Modal({ title, children, onClose, wide = false }) {
  const overlay = useRef(null);
  const dialog = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const id = useId();
  const { modalStack, registerModal, unregisterModal } = useUI();
  useEffect(() => {
    registerModal(id);
    return () => unregisterModal(id);
  }, [id, registerModal, unregisterModal]);
  useEffect(() => {
    const previous = document.activeElement;
    dialog.current?.focus();
    const handleKey = (event) => {
      if (modalStack[modalStack.length - 1] !== id) return;
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key === 'Tab') {
        const elements = [...dialog.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')];
        if (!elements.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      previous?.focus?.();
    };
  }, [id, modalStack]);
  return (
    <div className="ov" ref={overlay} onMouseDown={(event) => { if (event.target === overlay.current) onClose(); }}>
      <div className={`md ${wide ? 'w' : ''}`} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={dialog}>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}
