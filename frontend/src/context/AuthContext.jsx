import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCurrentUser,
    loginUser,
    registerUser
} from "../services/api";


const AuthContext =
    createContext(null);


export function AuthProvider({
    children
}) {

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // -------------------------
    // Check existing login
    // -------------------------

    useEffect(() => {

        const token =
            localStorage.getItem(
                "access_token"
            );

        if (!token) {
            setLoading(false);
            return;
        }


        getCurrentUser()

            .then((data) => {
                setUser(data);
            })

            .catch(() => {
                localStorage.removeItem(
                    "access_token"
                );

                setUser(null);
            })

            .finally(() => {
                setLoading(false);
            });

    }, []);


    // -------------------------
    // Login
    // -------------------------

    async function login(
        email,
        password
    ) {

        const data =
            await loginUser(
                email,
                password
            );

        localStorage.setItem(
            "access_token",
            data.access_token
        );

        const currentUser =
            await getCurrentUser();

        setUser(currentUser);
    }


    // -------------------------
    // Register
    // -------------------------

    async function register(
        name,
        email,
        password
    ) {

        await registerUser(
            name,
            email,
            password
        );

        // Registration ke baad
        // automatically login
        await login(
            email,
            password
        );
    }


    // -------------------------
    // Logout
    // -------------------------

    function logout() {

        localStorage.removeItem(
            "access_token"
        );

        setUser(null);
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(
        AuthContext
    );
}