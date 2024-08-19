cat <<EOL > src/services/categoryService.js
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../api/repositories/categoryRepository';

export const fetchCategories = async () => {
  try {
    const response = await getCategories();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryById = async id => {
  try {
    const response = await getCategoryById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
EOL

# Create subcategoryService.js
cat <<EOL > src/services/subcategoryService.js
import { getSubcategories, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory } from '../api/repositories/subcategoryRepository';

export const fetchSubcategories = async () => {
  try {
    const response = await getSubcategories();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchSubcategoryById = async id => {
  try {
    const response = await getSubcategoryById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
EOL

# Create taskService.js
cat <<EOL > src/services/taskService.js
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from '../api/repositories/taskRepository';

export const fetchTasks = async () => {
  try {
    const response = await getTasks();
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTaskById = async id => {
  try {
    const response = await getTaskById(id);
    return response.data;
  } catch (error) {
    throw error;
  }
};
EOL

# Create authMiddleware.js
cat <<EOL > src/middlewares/authMiddleware.js
export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // You can add JWT verification logic here
  next();
};
EOL

# Create rbacMiddleware.js
cat <<EOL > src/middlewares/rbacMiddleware.js
export const rbacMiddleware = roles => (req, res, next) => {
  const userRole = req.user.role;

  if (!roles.includes(userRole)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
EOL

# Create auth.js
cat <<EOL > src/utils/auth.js
import apiClient from '../api/apiClient';

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/local', {
      identifier: email,
      password: password,
    });

    localStorage.setItem('authToken', response.data.jwt);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
};
EOL

# Create rbac.js
cat <<EOL > src/utils/rbac.js
export const checkUserRole = (user, requiredRole) => {
  return user.role === requiredRole;
};
EOL

echo "API layer setup for all collections completed!"
