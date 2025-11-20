// src/api.js

const API_URL = "http://localhost:3000/api"; 

import * as SecureStore from 'expo-secure-store';

// Busca o token JWT salvo
async function getToken() {
  return await SecureStore.getItemAsync('token');
}

// Requisição GET autenticada
export async function apiGet(endpoint) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  });
  return res.json();
}

// Requisição POST autenticada
export async function apiPost(endpoint, body) {
  const token = await getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

// Requisição POST pública (ex: login, cadastro)
export async function apiPostPublic(endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}
