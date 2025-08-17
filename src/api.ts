import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (token)
    config.headers.Authorization = `Bearer ${token}`;

  return config;
});

export const getAll = async () => {
  return api.get(`/tetris_api/games/all/`);
};

export const login = async (
  username: string,
  password: string
) => {
  return axios.post(`${baseURL}/tetris_api/token/`, {
    username,
    password,
  });
};

export const register = async (
  username: string,
  password: string
) => {
  return axios.post(`tetris_api/user/register/`, {
    username,
    password,
  });
};

export default api;
