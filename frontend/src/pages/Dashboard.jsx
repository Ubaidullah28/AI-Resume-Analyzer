import {
    useAuth
} from "../context/AuthContext";

import {
    useNavigate
} from "react-router-dom";


export default function Dashboard() {

    const {
        user,
        logout
    } = useAuth();

    const navigate =
        useNavigate();


    function handleLogout() {

        logout();

        navigate(
            "/login"
        );
    }


    return (
        <div className="dashboard">

            <header className="navbar">

                <div className="logo">
                    ResumeAI
                </div>


                <div className="nav-right">

                    <span>
                        {user?.name}
                    </span>

                    <button
                        className="logout-btn"
                        onClick={
                            handleLogout
                        }
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="dashboard-content">

                <div className="hero">

                    <p className="eyebrow">
                        AI Resume Analyzer
                    </p>

                    <h1>
                        Make your resume
                        <br />
                        <span>
                            job-ready.
                        </span>
                    </h1>

                    <p>
                        Upload your resume,
                        analyze it against a
                        job description, and get
                        actionable AI feedback.
                    </p>

                </div>


                <div className="dashboard-grid">

                    <div
                        className="feature-card"
                        onClick={() =>
                            navigate(
                                "/analyze"
                            )
                        }
                    >
                        <div className="icon">
                            ↑
                        </div>

                        <h2>
                            Analyze Resume
                        </h2>

                        <p>
                            Upload a resume and
                            compare it against
                            any job description.
                        </p>

                        <span>
                            Start analysis →
                        </span>
                    </div>


                    <div
                        className="feature-card"
                        onClick={() =>
                            navigate(
                                "/history"
                            )
                        }
                    >
                        <div className="icon">
                            ◷
                        </div>

                        <h2>
                            Analysis History
                        </h2>

                        <p>
                            View your previous
                            ATS scores and
                            AI feedback.
                        </p>

                        <span>
                            View history →
                        </span>
                    </div>

                </div>

            </main>

        </div>
    );
}