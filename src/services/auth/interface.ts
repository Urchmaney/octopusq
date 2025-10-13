export interface AuthService {
    login: (email: string, password: string) => Promise<string>;
    register: (email: string, password: string, displayName: string) => Promise<string>;
    logout: () => Promise<void>;
    getCurrentUser: () => Promise<string | null>;
    sendPasswordResetEmail: (email: string) => Promise<void>;
    confirmPasswordReset: (code: string, newPassword: string) => Promise<void>;
    userProfile: () => Promise<{ email_address: string; full_name: string } | null>;
}
