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


export default function Register() {

    const navigate =
        useNavigate();

    const {
        register
    } = useAuth();


    const [name, setName] =
        useState("");

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

            await register(
                name,
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
                    Create your account
                </h1>

                <p className="subtitle">
                    Start improving your
                    resume today
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
                        Full Name
                    </label>

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        required
                    />


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
                        minLength={8}
                        required
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create account"}
                    </button>

                </form>


                <p className="auth-footer">
                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </div>

        </div>
    );
}