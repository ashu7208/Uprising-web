import { useUI } from '../context/UIContext';

export default function useToast() {
  return useUI().toast;
}
