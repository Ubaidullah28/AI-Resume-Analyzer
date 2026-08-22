import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    uploadResume,
    analyzeResume,
    getAIFeedback
} from "../services/api";


export default function Analyze() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);

    const [jobDescription, setJobDescription] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // -----------------------------
    // File selection
    // -----------------------------

    function handleFileChange(event) {

        const selectedFile =
            event.target.files[0];


        if (!selectedFile) {
            return;
        }


        // PDF validation

        if (
            selectedFile.type !==
            "application/pdf"
        ) {

            setFile(null);

            setError(
                "Only PDF resumes are allowed."
            );

            return;
        }


        // Size validation
        // 5 MB maximum

        const maxSize =
            5 * 1024 * 1024;


        if (
            selectedFile.size >
            maxSize
        ) {

            setFile(null);

            setError(
                "Resume must be smaller than 5 MB."
            );

            return;
        }


        setFile(
            selectedFile
        );

        setError("");
    }


    // -----------------------------
    // Analyze
    // -----------------------------

    async function handleAnalyze(event) {

        event.preventDefault();

        setError("");

        // -----------------------------
        // Validate file
        // -----------------------------

        if (!file) {

            setError(
                "Please select a resume PDF."
            );

            return;
        }


        // -----------------------------
        // Validate job description
        // -----------------------------

        if (!jobDescription.trim()) {

            setError(
                "Please enter a job description."
            );

            return;
        }


        try {

            setLoading(true);


            // =====================================
            // STEP 1: Upload Resume
            // =====================================

            const resume =
                await uploadResume(file);

            console.log(
                "Resume uploaded:",
                resume
            );


            // =====================================
            // STEP 2: ATS Analysis
            // =====================================

            const analysis =
                await analyzeResume(
                    resume.id,
                    jobDescription
                );

            console.log(
                "ATS analysis:",
                analysis
            );


            // =====================================
            // STEP 3: AI Feedback
            // =====================================

            const aiFeedback =
                await getAIFeedback(
                    analysis.id
                );

            console.log(
                "AI feedback:",
                aiFeedback
            );


            // =====================================
            // STEP 4: Store complete result
            // =====================================

            const completeResult = {

                analysis: analysis,

                aiFeedback: aiFeedback

            };


            sessionStorage.setItem(
                "latest_analysis",
                JSON.stringify(
                    completeResult
                )
            );


            // =====================================
            // STEP 5: Go to Results
            // =====================================

            navigate(
                "/results"
            );


        } catch (err) {

            console.error(
                "Analysis error:",
                err
            );

            setError(
                err.message ||
                "Analysis failed. Please try again."
            );


        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="analyze-page">

            {/* Navbar */}

            <header className="navbar">

                <div
                    className="logo"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ResumeAI
                </div>

                <button
                    className="back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </header>


            {/* Main */}

            <main className="analyze-container">

                <div className="analyze-header">

                    <p className="eyebrow">
                        AI Resume Analyzer
                    </p>

                    <h1>
                        Analyze your resume
                    </h1>

                    <p>
                        Upload your resume and
                        compare it with the job
                        description.
                    </p>

                </div>


                <form
                    className="analyze-card"
                    onSubmit={handleAnalyze}
                >

                    {/* Resume */}

                    <div className="form-group">

                        <label>
                            Resume
                        </label>

                        <div className="file-upload">

                            <input
                                type="file"
                                accept=".pdf"
                                onChange={
                                    handleFileChange
                                }
                            />

                            {file && (

                        <div className="file-name">

                            ✓ Selected:
                            {" "}
                            {file.name}

                            <br />

                            <small>
                                {(file.size / 1024 / 1024).toFixed(2)}
                                {" "}
                                MB
                            </small>

                        </div>

                    )}

                        </div>

                    </div>


                    {/* Job Description */}

                    <div className="form-group">

                        <label>
                            Job Description
                        </label>

                        <textarea
                            value={
                                jobDescription
                            }
                            onChange={
                                (e) =>
                                    setJobDescription(
                                        e.target.value
                                    )
                            }
                            placeholder={
                                "Paste the job description here..."
                            }
                            rows="10"
                        />

                    </div>


                    {/* Error */}

                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    {/* Submit */}

                    <button
                        type="submit"
                        className="analyze-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Uploading & analyzing..."
                            : "Analyze Resume →"
                        }
                    </button>

                </form>

            </main>

        </div>

    );
}