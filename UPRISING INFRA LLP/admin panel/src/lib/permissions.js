/** Checks the prototype's role/module/action permission rules. */
export function can(role, module, action = 'view') {
  if (!role) return false;
  if (role === 'Super Admin') return true;
  if (role === 'Admin') return !['users', 'backup'].includes(module);
  const editorModules = ['dashboard', 'home', 'about', 'services', 'projects', 'clients', 'leadership', 'faqs', 'media', 'site'];
  return role === 'Editor' && editorModules.includes(module) && !['delete', 'publish'].includes(action);
}
