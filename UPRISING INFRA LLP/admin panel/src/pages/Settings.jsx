import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { can } from '../lib/permissions';
import DynamicForm from '../components/forms/DynamicForm';

const fields = [
  ['company', 'Company name', 'text'], ['email', 'Primary email', 'text'], ['phone', 'Phone number', 'text'], ['whatsapp', 'WhatsApp number', 'text'],
  ['office', 'Registered office address', 'textarea'], ['site', 'Work site address', 'textarea'], ['maps', 'Google Maps link', 'text'],
  ['facebook', 'Facebook URL', 'text'], ['instagram', 'Instagram URL', 'text'], ['linkedin', 'LinkedIn URL', 'text'],
  ['timings', 'Business timings', 'text'], ['cta', 'Global CTA button text', 'text'], ['gst', 'GST number', 'text'], ['llpin', 'LLPIN', 'text'],
];

export default function Settings() {
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [value, setValue] = useState(Object.fromEntries(fields.map(([key]) => [key, state.settings[key] || ''])));
  const save = () => {
    const success = commit(user, 'settings', 'edit', fields.map(([key]) => key).join(', '), '', (draft) => {
      Object.assign(draft.settings, value);
    }, 'Updated settings');
    if (success) toast('Saved. The website now uses these details.');
  };
  return <div className="card"><DynamicForm fields={fields} value={value} onChange={setValue} className="row2" /><button className="b" disabled={!can(user?.role, 'settings', 'edit')} onClick={save}>Save settings</button></div>;
}
