export const authClient = createAuthClient({
    baseURL: import.meta.env.VITE_API_URL,
    callbackURL: `${import.meta.env.VITE_CLIENT_URL}/choose-role`,
});