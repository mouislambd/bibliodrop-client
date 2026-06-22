import { createContext, useContext } from "react";
import { authClient } from "../utils/auth-client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const { data: session, isPending, refetch } = authClient.useSession();

    const user = session?.user
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            photo: session.user.image || "",
            role: session.user.role || "user",
        }
        : null;

    const getJwtToken = async (email) => {
        try {
            await fetch("https://bibliodrop-server.onrender.com/api/users/google-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email }),
            });
        } catch (e) { }
    };

    const register = async ({ name, email, password, photo, role }) => {
        const result = await authClient.signUp.email({
            name,
            email,
            password,
            image: photo,
            role,
        });
        if (result.error) throw { response: { data: { message: result.error.message } } };
        await getJwtToken(email);
        await refetch();
        return result;
    };

    const login = async ({ email, password }) => {
        const result = await authClient.signIn.email({ email, password });
        if (result.error) throw { response: { data: { message: result.error.message } } };
        await getJwtToken(email);
        await refetch();
        return result;
    };

    const logout = async () => {
        await authClient.signOut();
        await refetch();
    };

    const loginWithGoogle = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "https://bibliodrop-client-sand.vercel.app/choose-role"
        });
    };

    return (
        <AuthContext.Provider
            value={{ user, loading: isPending, login, register, logout, loginWithGoogle, fetchUser: refetch }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);