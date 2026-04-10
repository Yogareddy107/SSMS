import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const getHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};
