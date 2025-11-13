export const ROLES = {
  ADMIN: 'Lab Administrator',
  TECHNICIAN: 'Lab Technician',
  SUPERVISOR: 'Lab Supervisor',
  RECEPTIONIST: 'Reception Staff',
  PROVIDER: 'Healthcare Provider',
  COLLECTOR: 'Specimen Collector',
};

export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role) || user.role === ROLES.ADMIN;
  }
  return user.role === requiredRoles || user.role === ROLES.ADMIN;
};

export const canAccess = (user, path) => {
  const rolePermissions = {
    '/users': [ROLES.ADMIN],
    '/patients': [ROLES.ADMIN, ROLES.RECEPTIONIST, ROLES.PROVIDER],
    '/specimens': [ROLES.ADMIN, ROLES.COLLECTOR, ROLES.TECHNICIAN],
    '/testing': [ROLES.ADMIN, ROLES.TECHNICIAN, ROLES.SUPERVISOR],
    '/results': [ROLES.ADMIN, ROLES.TECHNICIAN, ROLES.SUPERVISOR, ROLES.PROVIDER],
  };

  const allowedRoles = rolePermissions[path] || [];
  return hasRole(user, allowedRoles);
};

