import Field from './Field';
import { useStore } from '../../context/StoreContext';

export default function DynamicForm({ fields, value, onChange, className = '' }) {
  const { state } = useStore();
  const set = (name, fieldValue) => onChange({ ...value, [name]: fieldValue });
  return <div className={className}>{fields.map((field) => {
    const fieldValue = value[field[0]] ?? (field[2] === 'select' ? field[3]?.[0] ?? '' : field[2] === 'bool' ? false : '');
    return <Field key={field[0]} field={field} value={fieldValue} onChange={set} media={state.media} />;
  })}</div>;
}
