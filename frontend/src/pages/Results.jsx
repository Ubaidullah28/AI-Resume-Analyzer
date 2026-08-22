import {
    useEffect,
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    getAIFeedback
} from "../services/api";


export default function Results() {

    const navigate =
        useNavigate();


    const [result, setResult] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================
    // Load Result
    // =====================================

    useEffect(() => {

        async function loadResult() {

            try {

                // --------------------------------
                // Get saved analysis
                // --------------------------------

                const stored =
                    sessionStorage.getItem(
                        "latest_analysis"
                    );


                if (!stored) {

                    setError(
                        "No analysis result found."
                    );

                    setLoading(false);

                    return;
                }


                const parsed =
                    JSON.parse(stored);


                console.log(
                    "Stored result:",
                    parsed
                );


                // --------------------------------
                // New format
                // --------------------------------

                if (
                    parsed.analysis &&
                    parsed.aiFeedback
                ) {

                    setResult(
                        parsed
                    );

                    setLoading(false);

                    return;
                }


                // --------------------------------
                // Old format fallback
                // --------------------------------

                if (parsed.id) {

                    const aiFeedback =
                        await getAIFeedback(
                            parsed.id
                        );


                    setResult({

                        analysis: parsed,

                        aiFeedback:
                            aiFeedback

                    });

                    setLoading(false);

                    return;
                }


                setError(
                    "Invalid analysis data."
                );


            } catch (err) {

                console.error(
                    err
                );

                setError(
                    err.message ||
                    "Failed to load results."
                );

            } finally {

                setLoading(false);

            }
        }


        loadResult();

    }, []);


    // =====================================
    // Loading
    // =====================================

    if (loading) {

        return (

            <div className="results-page">

                <main className="results-container">

                    <div className="loading-card">

                        <h2>
                            Analyzing your resume...
                        </h2>

                        <p>
                            AI is reviewing your
                            resume against the
                            job description.
                        </p>

                    </div>

                </main>

            </div>

        );
    }


    // =====================================
    // Error
    // =====================================

    if (error) {

        return (

            <div className="results-page">

                <main className="results-container">

                    <div className="error-message">

                        {error}

                    </div>


                    <button
                        className="analyze-btn"
                        onClick={() =>
                            navigate(
                                "/analyze"
                            )
                        }
                    >
                        Analyze Resume
                    </button>

                </main>

            </div>

        );
    }


    // =====================================
    // Extract Data
    // =====================================

    const analysis =
        result?.analysis || {};


    const ai =
        result?.aiFeedback || {};


    const atsScore =
        analysis.ats_score ??
        analysis.score ??
        0;


    const summary =
        ai.summary ||
        ai.resume_match ||
        ai.match_summary ||
        "No summary available.";


    const strengths =
        Array.isArray(
            ai.strengths
        )
            ? ai.strengths
            : [];


    const weaknesses =
        Array.isArray(
            ai.weaknesses
        )
            ? ai.weaknesses
            : [];


    const missingSkills =
        Array.isArray(
            ai.missing_skills
        )
            ? ai.missing_skills
            : [];


    const suggestions =
        Array.isArray(
            ai.improvement_suggestions
        )
            ? ai.improvement_suggestions
            : (
                Array.isArray(
                    ai.suggestions
                )
                    ? ai.suggestions
                    : []
            );


    return (

        <div className="results-page">

            {/* =================================
                HEADER
            ================================= */}

            <main className="results-container">

                <div className="results-header">

                    <p className="eyebrow">
                        AI RESUME ANALYSIS
                    </p>

                    <h1>
                        Your Resume Results
                    </h1>

                    <p>
                        Here's how your resume
                        performs against the
                        job description.
                    </p>

                </div>


                {/* =================================
                    ATS SCORE
                ================================= */}

                <section className="score-card">

                    <div>

                        <p className="score-label">
                            ATS Score
                        </p>

                        <h2>
                            {atsScore}%
                        </h2>

                        <p>
                            Resume match score
                        </p>

                    </div>


                    <div
                        className="score-circle"
                        style={{
                            background:
                                `conic-gradient(
                                    #5146e5
                                    ${atsScore * 3.6}deg,
                                    #e5e7eb
                                    ${atsScore * 3.6}deg
                                )`
                        }}
                    />

                </section>


                {/* =================================
                    RESUME MATCH
                ================================= */}

                <section className="result-section">

                    <h2>
                        Resume Match
                    </h2>

                    <div className="result-card">

                        <p>
                            {summary}
                        </p>

                    </div>

                </section>


                {/* =================================
                    STRENGTHS / WEAKNESSES
                ================================= */}

                <div className="two-column">


                    {/* Strengths */}

                    <section className="result-section">

                        <h2>
                            Strengths
                        </h2>

                        <div className="result-card">

                            {strengths.length > 0 ? (

                                <ul>

                                    {strengths.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <li
                                                key={
                                                    index
                                                }
                                            >
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p>
                                    No strengths
                                    found.
                                </p>

                            )}

                        </div>

                    </section>


                    {/* Weaknesses */}

                    <section className="result-section">

                        <h2>
                            Weaknesses
                        </h2>

                        <div className="result-card">

                            {weaknesses.length > 0 ? (

                                <ul>

                                    {weaknesses.map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <li
                                                key={
                                                    index
                                                }
                                            >
                                                {item}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p>
                                    No major
                                    weaknesses
                                    found.
                                </p>

                            )}

                        </div>

                    </section>

                </div>


                {/* =================================
                    MISSING SKILLS
                ================================= */}

                <section className="result-section">

                    <h2>
                        Missing Skills
                    </h2>

                    <div className="result-card">

                        {missingSkills.length > 0 ? (

                            <div className="skills-list">

                                {missingSkills.map(
                                    (
                                        skill,
                                        index
                                    ) => (

                                        <span
                                            className="skill-tag"
                                            key={
                                                index
                                            }
                                        >
                                            × {skill}
                                        </span>

                                    )
                                )}

                            </div>

                        ) : (

                            <p>
                                No missing skills
                                detected.
                            </p>

                        )}

                    </div>

                </section>


                {/* =================================
                    AI SUGGESTIONS
                ================================= */}

                <section className="result-section">

                    <h2>
                        AI Suggestions
                    </h2>

                    <div className="result-card">

                        {suggestions.length > 0 ? (

                            <ul>

                                {suggestions.map(
                                    (
                                        suggestion,
                                        index
                                    ) => (

                                        <li
                                            key={
                                                index
                                            }
                                        >
                                            {suggestion}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <p>
                                No suggestions
                                available.
                            </p>

                        )}

                    </div>

                </section>


                {/* =================================
                    BUTTONS
                ================================= */}

                <div className="results-actions">

                    <button
                        className="secondary-btn"
                        onClick={() =>
                            navigate(
                                "/analyze"
                            )
                        }
                    >
                        Analyze Another Resume
                    </button>


                    <button
                        className="primary-btn"
                        onClick={() =>
                            navigate(
                                "/dashboard"
                            )
                        }
                    >
                        Back to Dashboard
                    </button>

                </div>

            </main>

        </div>

    );
}