import { useAuth } from '../context/AuthContext';
import { can } from '../lib/permissions';

export function useCan(module, action = 'view') {
  const { user } = useAuth();
  return can(user?.role, module, action);
}
