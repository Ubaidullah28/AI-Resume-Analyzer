import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getResumeHistory,
    deleteResume,
    getATSHistory,
    getAnalysis
} from "../services/api";


export default function History() {

    const navigate =
        useNavigate();


    const [resumes, setResumes] =
        useState([]);

    const [analyses, setAnalyses] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================
    // Load History
    // =========================================

    useEffect(() => {

        loadHistory();

    }, []);


    async function loadHistory() {

        try {

            setLoading(true);

            setError("");


            // ---------------------------------
            // Resume history
            // ---------------------------------

            const resumeData =
                await getResumeHistory();


            console.log(
                "Resume history:",
                resumeData
            );


            // ---------------------------------
            // ATS history
            // ---------------------------------

            const atsData =
                await getATSHistory();


            console.log(
                "ATS history:",
                atsData
            );


            // Backend may return array directly
            // or inside a property.

            const resumeList =
                Array.isArray(resumeData)
                    ? resumeData
                    : (
                        resumeData.resumes ||
                        resumeData.data ||
                        []
                    );


            const atsList =
                Array.isArray(atsData)
                    ? atsData
                    : (
                        atsData.analyses ||
                        atsData.data ||
                        []
                    );


            setResumes(
                resumeList
            );

            setAnalyses(
                atsList
            );


        } catch (err) {

            console.error(
                "History error:",
                err
            );

            setError(
                err.message ||
                "Failed to load history."
            );

        } finally {

            setLoading(false);

        }
    }


    // =========================================
    // Delete Resume
    // =========================================

    async function handleDelete(
        resumeId
    ) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this resume?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteResume(
                resumeId
            );


            // Remove deleted resume
            // immediately from UI.

            setResumes(
                previous =>
                    previous.filter(
                        resume =>
                            resume.id !== resumeId
                    )
            );


            // Remove related analyses too.

            setAnalyses(
                previous =>
                    previous.filter(
                        analysis =>
                            analysis.resume_id !==
                            resumeId
                    )
            );


        } catch (err) {

            console.error(
                err
            );

            setError(
                err.message ||
                "Failed to delete resume."
            );
        }
    }


    // =========================================
    // Open Analysis
    // =========================================

    async function handleViewAnalysis(
        analysis
    ) {

        try {

            const fullAnalysis =
                await getAnalysis(
                    analysis.id
                );


            /*
                Backend analysis ko
                temporary sessionStorage
                mein save kar rahe hain.

                Results page isko read karega.
            */

            sessionStorage.setItem(
                "latest_analysis",
                JSON.stringify({

                    analysis:
                        fullAnalysis,

                    aiFeedback:
                        fullAnalysis.ai_feedback ||
                        {}

                })
            );


            navigate(
                "/results"
            );


        } catch (err) {

            console.error(
                err
            );

            setError(
                err.message ||
                "Failed to open analysis."
            );
        }
    }


    // =========================================
    // Loading
    // =========================================

    if (loading) {

        return (

            <div className="history-page">

                <main className="history-container">

                    <div className="loading-card">

                        <h2>
                            Loading history...
                        </h2>

                        <p>
                            Fetching your previous
                            resume analyses.
                        </p>

                    </div>

                </main>

            </div>
        );
    }


    return (

        <div className="history-page">

            {/* =================================
                NAVBAR
            ================================= */}

            <header className="navbar">

                <div
                    className="logo"
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                >
                    ResumeAI
                </div>


                <button
                    className="back-btn"
                    onClick={() =>
                        navigate(
                            "/dashboard"
                        )
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* =================================
                MAIN
            ================================= */}

            <main className="history-container">

                <div className="history-header">

                    <p className="eyebrow">
                        RESUME HISTORY
                    </p>

                    <h1>
                        Your Analyses
                    </h1>

                    <p>
                        View and manage your
                        previous resume analyses.
                    </p>

                </div>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="error-message">

                        {error}

                    </div>

                )}


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {resumes.length === 0 ? (

                    <div className="empty-card">

                        <h2>
                            No resumes yet
                        </h2>

                        <p>
                            Upload your first
                            resume to start
                            analyzing it.
                        </p>


                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate(
                                    "/analyze"
                                )
                            }
                        >
                            Analyze Resume →
                        </button>

                    </div>

                ) : (

                    /* =================================
                       RESUME LIST
                    ================================= */

                    <div className="history-list">

                        {resumes.map(
                            resume => {

                                /*
                                    Find analyses
                                    belonging to
                                    this resume.
                                */

                                const resumeAnalyses =
                                    analyses.filter(
                                        analysis =>
                                            analysis.resume_id ===
                                            resume.id
                                    );


                                return (

                                    <div
                                        className="history-card"
                                        key={
                                            resume.id
                                        }
                                    >

                                        {/* Resume info */}

                                        <div className="history-info">

                                            <h2>
                                                {
                                                    resume.filename ||
                                                    `Resume #${resume.id}`
                                                }
                                            </h2>


                                            <p>

                                                Uploaded:{" "}

                                                {
                                                    resume.uploaded_at
                                                        ? new Date(
                                                            resume.uploaded_at
                                                        ).toLocaleString()
                                                        : "Unknown"
                                                }

                                            </p>

                                        </div>


                                        {/* Analysis */}

                                        <div className="history-score">

                                            {resumeAnalyses.length >
                                            0 ? (

                                                resumeAnalyses.map(
                                                    analysis => (

                                                        <div
                                                            className="analysis-row"
                                                            key={
                                                                analysis.id
                                                            }
                                                        >

                                                            <div>

                                                                <strong>
                                                                    ATS Score
                                                                </strong>

                                                                <span className="score-small">

                                                                    {
                                                                        analysis.ats_score ??
                                                                        0
                                                                    }%

                                                                </span>

                                                            </div>


                                                            <div className="analysis-date">

                                                                {
                                                                    analysis.created_at
                                                                        ? new Date(
                                                                            analysis.created_at
                                                                        ).toLocaleDateString()
                                                                        : ""
                                                                }

                                                            </div>


                                                            <button
                                                                className="view-btn"
                                                                onClick={() =>
                                                                    handleViewAnalysis(
                                                                        analysis
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </button>

                                                        </div>

                                                    )
                                                )

                                            ) : (

                                                <p>
                                                    No analysis
                                                    available.
                                                </p>

                                            )}

                                        </div>


                                        {/* Delete */}

                                        <button
                                            className="delete-btn"
                                            onClick={() =>
                                                handleDelete(
                                                    resume.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                );
                            }
                        )}

                    </div>

                )}


                {/* =================================
                    NEW ANALYSIS
                ================================= */}

                <div className="history-actions">

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate(
                                "/analyze"
                            )
                        }
                    >
                        + Analyze Another Resume
                    </button>

                </div>

            </main>

        </div>

    );
}