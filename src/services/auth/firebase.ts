import { browserLocalPersistence, createUserWithEmailAndPassword, inMemoryPersistence, setPersistence, signInWithEmailAndPassword, signOut, updateProfile, } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { AuthService } from ".";


export const authService: AuthService = {
    login: async function (email: string, password: string): Promise<string> {
        await setPersistence(firebaseAuth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return userCredential.user.uid;
    },
    register: async function (email: string, password: string, displayName: string): Promise<string> {
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateProfile(userCredential.user, { displayName });
        return userCredential.user.uid;
    },
    logout: async function (): Promise<void> {
        await signOut(firebaseAuth);
    },
    getCurrentUser: async function (): Promise<string | null> {
        const user = firebaseAuth.currentUser;
        return user ? user.uid : null;
    },
    sendPasswordResetEmail: function (_: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    confirmPasswordReset: function (_: string, __: string): Promise<void> {
        throw new Error("Function not implemented.");
    },
    userProfile: function (): Promise<{ email_address: string; full_name: string; } | null> {
        const user = firebaseAuth.currentUser;
        if (user) {
            return Promise.resolve({ email_address: user.email || "", full_name: user.displayName || "" });
        }
        return Promise.resolve(null);
    },
}
