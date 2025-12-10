const API_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem('token');
}

export async function apiGet(endpoint) {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  return res.json();
}

export async function apiPost(endpoint, body) {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function apiPostPublic(endpoint, body) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function apiPut(endpoint, body) {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

export async function apiDelete(endpoint) {
  const token = getToken();
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
  return res.json();
}

export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}
