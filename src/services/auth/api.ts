

import axios from 'axios';
import { AuthService } from './interface';
const BASE_URL = "http://127.0.0.1:3000";

const instance = axios.create({
  withCredentials: true,
  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService: AuthService = {
  login: async function (email: string, password: string): Promise<string> {
    return instance.post("/sessions", {
      email_address: email, password
    });
  },
  register: function (email: string, password: string, displayName: string): Promise<string> {
    return instance.post("/sign_up", {
      email_address: email, password, full_name: displayName
    });
  },
  logout: function (): Promise<void> {
    return instance.delete("/sessions/1");
  },
  getCurrentUser: function (): Promise<string | null> {
    throw new Error('Function not implemented.');
  },
  sendPasswordResetEmail: function (_: string): Promise<void> {
    throw new Error('Function not implemented.');
  },
  confirmPasswordReset: function (_: string, __: string): Promise<void> {
    throw new Error('Function not implemented.');
  },
  userProfile: function (): Promise<{ email_address: string; full_name: string; } | null> {
    return instance.get("/users", { withCredentials: true })
  }
}


export async function userWorkspaces() {
  return instance.get("/users/workspaces", { withCredentials: true })
}

export async function createUserWorkspace(name: string) {
  return instance.post("/users/workspaces", { workspace: { name } }, { withCredentials: true })
}