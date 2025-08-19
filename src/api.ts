import axios from 'axios';
import { ACCESS_TOKEN } from './constants';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
});

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    skipAuth?: boolean;
  }
}

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  if ('X-Skip-Auth' in config.headers) {
    delete (config.headers as any)['X-Skip-Auth'];
    return config;
  }
  const token = localStorage.getItem(ACCESS_TOKEN);

  if (token)
    (config.headers as any).Authorization =
      `Bearer ${token}`;
  else delete (config.headers as any).Authorization;
  return config;
});

export const getAll = () =>
  api.get(`${baseURL}/tetris_api/games/all/`, {
    headers: { 'X-Skip-Auth': '1' },
  });

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
  return axios.post(
    `${baseURL}/tetris_api/user/register/`,
    {
      username,
      password,
    }
  );
};

export default api;
