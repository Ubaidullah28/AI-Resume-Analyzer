import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    registerUser,
    loginUser,
    getCurrentUser
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


    // --------------------------------
    // Load existing login on startup
    // --------------------------------

    useEffect(() => {

        async function loadUser() {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            if (!token) {

                setLoading(false);

                return;
            }


            try {

                const currentUser =
                    await getCurrentUser();

                setUser(
                    currentUser
                );


            } catch (error) {

                console.error(
                    "Failed to load user:",
                    error
                );

                localStorage.removeItem(
                    "access_token"
                );

                setUser(null);


            } finally {

                setLoading(false);
            }
        }


        loadUser();

    }, []);


    // --------------------------------
    // Normal Register
    // --------------------------------

    async function register(
        name,
        email,
        password
    ) {

        const data =
            await registerUser(
                name,
                email,
                password
            );


        // Backend registration response
        // should contain access_token

        if (data?.access_token) {

            localStorage.setItem(
                "access_token",
                data.access_token
            );


            const currentUser =
                await getCurrentUser();


            setUser(
                currentUser
            );
        }


        return data;
    }


    // --------------------------------
    // Normal Login
    // --------------------------------

    async function login(
        email,
        password
    ) {

        const data =
            await loginUser(
                email,
                password
            );


        if (!data?.access_token) {

            throw new Error(
                "Login failed: no access token received."
            );
        }


        localStorage.setItem(
            "access_token",
            data.access_token
        );


        const currentUser =
            await getCurrentUser();


        setUser(
            currentUser
        );


        return data;
    }


    // --------------------------------
    // Google Login
    // --------------------------------

    async function loginWithGoogleToken(
        accessToken
    ) {

        if (!accessToken) {

            throw new Error(
                "Google login did not return an access token."
            );
        }


        // Save JWT
        localStorage.setItem(
            "access_token",
            accessToken
        );


        // Fetch our own application's user
        const currentUser =
            await getCurrentUser();


        // Update React authentication state
        setUser(
            currentUser
        );


        return currentUser;
    }


    // --------------------------------
    // Logout
    // --------------------------------

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
                register,
                login,
                loginWithGoogleToken,
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