import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
    callbackURL: `${import.meta.env.VITE_CLIENT_URL}/choose-role`,
});

export const { signIn, signUp, signOut, useSession } = authClient;