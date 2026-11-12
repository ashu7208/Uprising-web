import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useUI } from '../context/UIContext';
import { readImageFile } from '../lib/media';
import { useDebounce } from '../hooks/useDebounce';
import { can } from '../lib/permissions';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';

export default function MediaLibrary() {
  const { state, commit } = useStore();
  const { user } = useAuth();
  const { toast } = useUI();
  const [query, setQuery] = useState('');
  const search = useDebounce(query);
  const [type, setType] = useState('');
  const [altRecord, setAltRecord] = useState(null);
  const [alt, setAlt] = useState('');
  const [deleting, setDeleting] = useState(null);
  const uploadInput = useRef(null);
  const replaceInput = useRef(null);
  const [replacing, setReplacing] = useState(null);

  const upload = async (files, replaceId = null) => {
    for (const file of [...files]) {
      try {
        const image = await readImageFile(file);
        commit(user, 'media', 'edit', image.name, '', (draft) => {
          if (replaceId) {
            const record = draft.media.find((item) => item.id === replaceId);
            if (record) Object.assign(record, image);
          } else draft.media.push({ id: draft.nid++, alt: '', ...image });
        }, replaceId ? 'Replaced image' : 'Uploaded image');
        toast(replaceId ? 'Image replaced everywhere it is used' : `${image.name} uploaded`);
        if (replaceId) break;
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  };
  const visible = state.media.filter((item) => (!search || `${item.name}${item.alt}`.toLowerCase().includes(search.toLowerCase())) && (!type || item.type.includes(type)));
  const saveAlt = () => {
    const success = commit(user, 'media', 'edit', altRecord.name, '', (draft) => {
      draft.media.find((item) => item.id === altRecord.id).alt = alt;
    }, 'Edited alt text');
    if (success) setAltRecord(null);
  };
  const remove = () => {
    const success = commit(user, 'media', 'delete', deleting.name, '', (draft) => {
      draft.media = draft.media.filter((item) => item.id !== deleting.id);
    }, 'Deleted image');
    if (success) setDeleting(null);
  };
  return <>
    <div className="tb"><input placeholder="Search images…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search images" />
      <select value={type} onChange={(event) => setType(event.target.value)} aria-label="Filter image type"><option value="">All types</option>{['jpeg', 'png', 'webp', 'svg+xml'].map((item) => <option key={item}>{item}</option>)}</select>
      <span className="sp" /><button className="b" disabled={!can(user?.role, 'media', 'edit')} onClick={() => uploadInput.current?.click()}>+ Upload image</button>
      <input ref={uploadInput} type="file" accept=".jpg,.jpeg,.png,.webp,.svg" multiple hidden onChange={(event) => { upload(event.target.files); event.target.value = ''; }} />
      <input ref={replaceInput} type="file" accept=".jpg,.jpeg,.png,.webp,.svg" hidden onChange={(event) => { if (event.target.files?.[0]) upload(event.target.files, replacing); event.target.value = ''; }} />
    </div>
    <div className="grid g4">{visible.length ? visible.map((item) => <div className="card" key={item.id}>
      <img src={item.src} alt={item.alt} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, background: '#eee' }} />
      <p style={{ margin: '8px 0 0' }}><b>{item.name}</b><br /><span className="mut sm">{item.w}×{item.h}px · {(item.size / 1024).toFixed(0)} KB · {item.type}</span></p>
      <button className="b2" onClick={() => { setAltRecord(item); setAlt(item.alt || ''); }}>Alt text</button>{' '}
      <button className="bg" disabled={!can(user?.role, 'media', 'edit')} onClick={() => { setReplacing(item.id); replaceInput.current?.click(); }}>Replace</button>{' '}
      <button className="bg" disabled={!can(user?.role, 'media', 'delete')} onClick={() => setDeleting(item)}>Delete</button>
    </div>) : <div className="card" style={{ gridColumn: '1 / -1' }}><EmptyState>No images yet. Upload JPG, PNG, WEBP or SVG (max 800 KB each).</EmptyState></div>}</div>
    {altRecord && <Modal title={altRecord.name} onClose={() => setAltRecord(null)}><div className="fld"><label htmlFor="alt-text">Alt text (SEO and accessibility)</label><input id="alt-text" value={alt} onChange={(event) => setAlt(event.target.value)} /></div><div className="r"><button className="b2" onClick={() => setAltRecord(null)}>Cancel</button><button className="b" onClick={saveAlt}>Save</button></div></Modal>}
    {deleting && <ConfirmDialog message="Delete this image? Items that use it will show no image." onCancel={() => setDeleting(null)} onConfirm={remove} />}
  </>;
}
