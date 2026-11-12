export default function Field({ field, value, onChange, media = [] }) {
  const [name, label, type, options] = field;
  if (type === 'bool') return <div className="fld"><label><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(name, event.target.checked)} style={{ width: 'auto' }} /> {label}</label></div>;
  if (type === 'select' || type === 'image') {
    return <div className="fld"><label htmlFor={`field-${name}`}>{label}</label><select id={`field-${name}`} value={value ?? ''} onChange={(event) => onChange(name, type === 'image' && event.target.value ? Number(event.target.value) : event.target.value)}>
      {type === 'image' && <option value="">— none —</option>}
      {(type === 'image' ? media : options || []).map((option) => type === 'image'
        ? <option value={option.id} key={option.id}>{option.name}</option>
        : <option key={option} value={option}>{option}</option>)}
    </select>{type === 'image' && !media.length && <small>Upload images in the Media Library first.</small>}</div>;
  }
  const Input = type === 'textarea' || type === 'lines' ? 'textarea' : 'input';
  return <div className="fld"><label htmlFor={`field-${name}`}>{label}</label><Input id={`field-${name}`} type={Input === 'input' ? 'text' : undefined} value={value ?? ''} onChange={(event) => onChange(name, event.target.value)} /></div>;
}
