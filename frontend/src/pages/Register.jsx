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


        // Basic validation

        if (!name.trim()) {

            setError(
                "Please enter your full name."
            );

            return;
        }


        if (!email.trim()) {

            setError(
                "Please enter your email."
            );

            return;
        }


        if (password.length < 8) {

            setError(
                "Password must be at least 8 characters."
            );

            return;
        }


        try {

            setLoading(true);


           await register(
                name,
                email,
                password
            );

            navigate(
                "/dashboard",
                {
                    state: {
                        message:
                            "Account created successfully!"
                    }
                }
            );


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Registration failed. Please try again."
            );


        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="auth-page">

            <div className="auth-card">

                {/* Logo */}

                <div className="auth-logo">
                    ResumeAI
                </div>


                {/* Heading */}

                <h1>
                    Create your account
                </h1>


                <p className="auth-subtitle">
                    Start improving your
                    resume today.
                </p>


                {/* Error */}

                {error && (

                    <div className="auth-error">
                        {error}
                    </div>

                )}


                {/* Form */}

                <form
                    className="auth-form"
                    onSubmit={
                        handleSubmit
                    }
                >

                    {/* Full Name */}

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            autoComplete="name"
                            required
                        />

                    </div>


                    {/* Email */}

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


                    {/* Password */}

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
                            minLength={8}
                            autoComplete="new-password"
                            required
                        />

                    </div>


                    {/* Submit */}

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating..."
                            : "Create account"
                        }

                    </button>

                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <GoogleLoginButton />


                {/* Login link */}

                <div className="auth-footer">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </div>

    );
}