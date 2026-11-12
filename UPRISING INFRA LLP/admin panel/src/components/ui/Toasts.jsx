import { useUI } from '../../context/UIContext';

export default function Toasts() {
  const { toasts } = useUI();
  return <div className="ts" aria-live="polite">{toasts.map((item) => <div className={item.type === 'error' ? 'er' : ''} key={item.id}>{item.message}</div>)}</div>;
}
