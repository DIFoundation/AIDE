import { getAuthToken } from "./cookies";

export const Authentication = async (name: string, email: string, password: string, role: string, refreshToken: string) => {
    const authToken = getAuthToken();

    const signUp = await fetch("https://aide-backend-qj4f.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
    });

    const signIn = await fetch("https://aide-backend-qj4f.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const signOut = await fetch("https://aide-backend-qj4f.onrender.com/api/auth/signout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
    });

    const refreashAccessToken = await fetch("https://aide-backend-qj4f.onrender.com/api/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
    });

    const resetPassword = await fetch("https://aide-backend-qj4f.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const updatePassword = await fetch("https://aide-backend-qj4f.onrender.com/api/auth/update-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify({ password }),
    });

    return {
        signUp,
        signIn,
        signOut,
        refreashAccessToken,
        resetPassword,
        updatePassword,
        };
}