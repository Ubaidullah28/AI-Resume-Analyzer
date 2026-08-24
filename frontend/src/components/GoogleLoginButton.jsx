import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import {
    googleLogin
} from "../services/api";


export default function GoogleLoginButton() {

    const buttonRef =
        useRef(null);

    const navigate =
        useNavigate();


    const {
        loginWithGoogleToken
    } = useAuth();


    const [error, setError] =
        useState("");


    useEffect(() => {

        function initializeGoogle() {

            if (
                !window.google ||
                !window.google.accounts ||
                !buttonRef.current
            ) {
                return;
            }


            window.google.accounts.id.initialize({

                client_id:
                    import.meta.env
                        .VITE_GOOGLE_CLIENT_ID,

                callback:
                    handleGoogleResponse

            });


            window.google.accounts.id.renderButton(

                buttonRef.current,

                {
                    theme: "outline",
                    size: "large",
                    width: Math.min(
                        360,
                        buttonRef.current.clientWidth || 360
                    ),
                    text: "continue_with",
                    shape: "rectangular"
                }

            );
        }


        if (window.google) {

            initializeGoogle();

            return;
        }


        const script =
            document.createElement(
                "script"
            );


        script.src =
            "https://accounts.google.com/gsi/client";


        script.async = true;
        script.defer = true;


        script.onload =
            initializeGoogle;


        script.onerror = () => {

            setError(
                "Failed to load Google authentication."
            );
        };


        document.head.appendChild(
            script
        );


        return () => {

            if (script.parentNode) {

                script.parentNode.removeChild(
                    script
                );
            }

        };

    }, []);


    async function handleGoogleResponse(
        response
    ) {

        try {

            setError("");


            if (!response?.credential) {

                throw new Error(
                    "Google did not provide a credential."
                );
            }


            // Send Google credential
            // to our FastAPI backend

            const data =
                await googleLogin(
                    response.credential
                );


            if (!data?.access_token) {

                throw new Error(
                    "Backend did not return an access token."
                );
            }


            /*
             * IMPORTANT:
             *
             * AuthContext ko bhi update karna hai.
             */

            await loginWithGoogleToken(
                data.access_token
            );


            // Now React knows user is authenticated

            navigate(
                "/dashboard"
            );


        } catch (err) {

            console.error(
                "Google authentication error:",
                err
            );


            setError(
                err?.message ||
                "Google login failed."
            );

        }

    }


    return (

        <div className="google-auth">

            <div
                ref={buttonRef}
            />


            {error && (

                <div className="auth-error">
                    {error}
                </div>

            )}

        </div>
    );
}