import { useCallback, useState } from 'react';

export default function useModal(initiallyOpen = false) {
  const [isOpen, setOpen] = useState(initiallyOpen);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  return { isOpen, open, close };
}
