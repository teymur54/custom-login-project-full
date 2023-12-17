import axios from 'axios';

const BASE_URL = 'http://172.16.4.146:8081/api';

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const signIn = async (credentials) => {
  try {
    const response = await instance.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const verifyJwt = async (jwt) => {
  try {
    const response = await instance.post('/auth/verify', { jwt });
    return response.data;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    throw error;
  }
};

export const getAllEmployees = async (token, pageSize = 10, pageNumber = 0, sortBy = 'lastName') => {
  try {
    const response = await instance.get('/pageEmployees', {
      params: {
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const getEmployeeById = async (id, token) => {
  try {
    const response = await instance.get(`/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    throw error;
  }
};

export const deleteEmployee = async (id, token) => {
  try {
    const response = await instance.delete(`/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};

export const createEmployee = async (employeeData, token) => {
  try {
    const response = await instance.post('/employees', employeeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating employee:", error);
    throw error;
  }
};

export const updateEmployee = async (id, updatedEmployeeData, token) => {
  try {
    const response = await instance.put(`/update/${id}`, updatedEmployeeData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const getAllPositions = async (token) => {
  try {
    const response = await instance.get('/positions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};

export const getAllDepartments = async (token) => {
  try {
    const response = await instance.get('/departments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    throw error;
  }
};

export const getAllRanks = async (token) => {
  try {
    const response = await instance.get('/ranks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching ranks:", error);
    throw error;
  }
};

export const findEmployee = async (token, data) => {
  try {
    const response = await instance.get(`/employees/byName/${data}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${data}:`, error);
    throw error;
  }
};

export const getFilteredPaginatedEmployees = async (token, data, pageSize = 10, pageNumber = 0, sortBy = 'lastName') => {
  try {
    const response = await instance.get(`/employees/allFields/${data}`, {
      params: {
        pageSize,
        pageNumber,
        sortBy,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching filtered paginated employees for ${data}:`, error);
    throw error;
  }
};

// 10.14.33.78:8080-nazirlik
// 172.16.4.146:8081-sinif