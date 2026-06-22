import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    baseURL: "https://bibliodrop-server.onrender.com",
});

export const { signIn, signUp, signOut, useSession } = authClient;