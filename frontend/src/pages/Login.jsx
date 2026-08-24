import {
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import {
    useAuth
} from "../context/AuthContext";

import GoogleLoginButton
    from "../components/GoogleLoginButton";


export default function Login() {

    const navigate =
        useNavigate();

    const {
        login
    } = useAuth();


    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleSubmit(e) {

        e.preventDefault();

        setError("");


        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;
        }


        if (!password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            await login(
                email,
                password
            );


            navigate(
                "/dashboard"
            );


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Login failed. Please check your credentials."
            );


        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                <Link className="auth-logo" to="/">
                    ResumeAI
                </Link>


                <h1>
                    Welcome back
                </h1>


                <p className="auth-subtitle">
                    Analyze your resume
                    with AI.
                </p>


                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                            autoComplete="email"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing in..."
                            : "Sign in"
                        }

                    </button>

                </form>


                <div className="auth-divider">
                    <span>OR</span>
                </div>


                <GoogleLoginButton />


                {/* ONLY ONE footer */}

                <div className="auth-footer">

                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Create account
                    </Link>

                </div>

            </div>

        </div>
    );
}