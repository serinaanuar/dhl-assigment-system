import axios from "axios";

const AUTH_TOKEN_KEY = "authToken";
const USER_ROLE_KEY = "userRole";
const USER_EMAIL_KEY = "userEmail";
const API_BASE = "http://localhost:3000";

const authClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getRole() {
  return localStorage.getItem(USER_ROLE_KEY);
}

export function getEmail() {
  return localStorage.getItem(USER_EMAIL_KEY);
}

export function isAuthenticated() {
  return !!getToken();
}

export function setSession({ token, role, email }) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(USER_ROLE_KEY, role);
  localStorage.setItem(USER_EMAIL_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
  localStorage.removeItem("auth");
}

export async function login(email, password) {
  const response = await authClient.post("/auth/login", { email, password });
  const { token, user } = response.data;
  setSession({ token, role: user.role, email: user.email });
  return user;
}

export async function fetchCurrentUser() {
  const token = getToken();
  if (!token) return null;
  const response = await authClient.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data.user;
}
