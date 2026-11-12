export default function Switch({ checked, onChange, label }) {
  return <button type="button" className={`sw ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} />;
}
