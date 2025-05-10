
import axios from 'axios';
const BASE_URL = "http://127.0.0.1:3000";

const instance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL, 

  headers: {
    'Content-Type': 'application/json'
  }

});

export async function login(email_address: string, password: string) {
  return instance.post("/sessions", {
    email_address, password
  });
}

export async function logout() {
  return instance.delete("/sessions/1");
}

export async function register(email_address: string, password: string, full_name: string) {
  return instance.post("/sign_up", {
    email_address, password, full_name
  });
}

export async function userProfile() {
  return instance.get("/users", { withCredentials: true })
}