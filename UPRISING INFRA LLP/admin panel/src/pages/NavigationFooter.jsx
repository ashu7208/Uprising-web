import { useState } from 'react';
import ListModule from '../components/lists/ListModule';
import DynamicForm from '../components/forms/DynamicForm';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';

const footerFields = [['footer', 'Company description', 'textarea'], ['copy', 'Copyright text', 'text']];

export default function NavigationFooter() {
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [value, setValue] = useState({ footer: state.settings.footer, copy: state.settings.copy });
  const save = () => {
    if (commit(user, 'navfooter', 'edit', 'footer', '', (draft) => Object.assign(draft.settings, value), 'Updated settings')) toast('Footer saved');
  };
  return <><h3>Header menu</h3><ListModule module="nav" /><h3>Footer</h3><div className="card"><DynamicForm fields={footerFields} value={value} onChange={setValue} className="row2" /><button className="b" onClick={save}>Save footer</button> <span className="mut sm">Phone, email and address come from Website Settings.</span></div></>;
}
