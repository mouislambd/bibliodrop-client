import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { useSession } from "../utils/auth-client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { data: session, isPending } = useSession();

    useEffect(() => {
        if (isPending) return;
        if (session?.user) {
            axiosInstance.post("/users/google-token", {
                email: session.user.email
            }).then(res => {
                setUser(res.data.user);
            }).catch(() => {
                setUser(session.user);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            fetchUser();
        }
    }, [session, isPending]);

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get("/user-auth/me");
            setUser(res.data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        const res = await axiosInstance.post("/user-auth/login", data);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (data) => {
        const res = await axiosInstance.post("/user-auth/register", data);
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        await axiosInstance.post("/user-auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);