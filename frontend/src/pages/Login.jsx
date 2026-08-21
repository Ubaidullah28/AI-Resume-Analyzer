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
        setLoading(true);


        try {

            await login(
                email,
                password
            );

            navigate(
                "/dashboard"
            );

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);

        }
    }


    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="logo">
                    ResumeAI
                </div>

                <h1>
                    Welcome back
                </h1>

                <p className="subtitle">
                    Analyze your resume
                    with AI
                </p>


                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}


                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <label>
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        required
                    />


                    <label>
                        Password
                    </label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>

                </form>


                <p className="auth-footer">
                    Don't have an account?

                    {" "}

                    <Link to="/register">
                        Create account
                    </Link>
                </p>

            </div>

        </div>
    );
}