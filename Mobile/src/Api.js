// src/Api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://10.92.232.121:3000'; 
const API_BASE = `${API_URL}/api`;

export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getUserId = async () => {
  return await AsyncStorage.getItem('usuarioId');
};

const buildHeaders = async (extra = {}) => {
  const token = await getToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    ...extra,
  };
};

export const apiGet = async (endpoint) => {
  const headers = await buildHeaders();
  const res = await fetch(`${API_BASE}${endpoint}`, { method: 'GET', headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const apiPost = async (endpoint, body) => {
  const headers = await buildHeaders();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const apiPostPublic = async (endpoint, body) => {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const apiPut = async (endpoint, body) => {
  const headers = await buildHeaders();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const apiDelete = async (endpoint) => {
  const headers = await buildHeaders();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const saveToken = async (token) => {
  await AsyncStorage.setItem('token', token);
};

export const saveUserId = async (userId) => {
  await AsyncStorage.setItem('usuarioId', String(userId));
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['token', 'usuarioId']);
};
