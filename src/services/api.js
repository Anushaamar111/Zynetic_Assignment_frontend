
import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response;
  } catch (error) {
    return error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response;
  } catch (error) {
    return error;
  }
};

const getAuthToken = () => localStorage.getItem("token");

const apiWithAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

apiWithAuth.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getAllProducts = async ({
  category,
  minPrice,
  maxPrice,
  search,
}) => {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (search) params.append("search", search);

  return axios.get(`/api/products?${params.toString()}`);
};

export const getProductById = async (id) => {
  try {
    const response = await apiWithAuth.get(`/products/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await apiWithAuth.post('/products', productData);
    return response;
  } catch (error) {
    return error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await apiWithAuth.put(`/products/${id}`, productData);
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await apiWithAuth.delete(`/products/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};
