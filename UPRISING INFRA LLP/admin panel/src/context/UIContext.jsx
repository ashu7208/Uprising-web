import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);
export const useUI = () => useContext(UIContext);

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modalStack, setModalStack] = useState([]);
  const toast = useCallback((message, type = '') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  }, []);
  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 800) setMobileOpen((open) => !open);
    else setCollapsed((value) => !value);
  }, []);
  const registerModal = useCallback((id) => setModalStack((stack) => [...stack.filter((entry) => entry !== id), id]), []);
  const unregisterModal = useCallback((id) => setModalStack((stack) => stack.filter((entry) => entry !== id)), []);
  const value = useMemo(() => ({ toasts, toast, collapsed, setCollapsed, mobileOpen, setMobileOpen, toggleSidebar, modalStack, registerModal, unregisterModal }), [toasts, toast, collapsed, mobileOpen, toggleSidebar, modalStack, registerModal, unregisterModal]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
