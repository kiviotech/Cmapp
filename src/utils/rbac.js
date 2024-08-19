export const checkUserRole = (user, requiredRole) => {
  return user.role === requiredRole;
};
