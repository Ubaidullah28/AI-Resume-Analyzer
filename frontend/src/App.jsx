import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import {
    AuthProvider
} from "./context/AuthContext";

import ProtectedRoute
    from "./components/ProtectedRoute";

import Analyze
    from "./pages/Analyze";

import Results
    from "./pages/Results";

import History
    from "./pages/History";

import Login
    from "./pages/Login";

import Register
    from "./pages/Register";

import Dashboard
    from "./pages/Dashboard";

import Home
    from "./pages/Home";

import Blog
    from "./pages/Blog";

import SeoArticle
    from "./pages/SeoArticle";

import {
    seoPages
} from "./data/seoContent";


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/* =====================
                        PUBLIC ROUTES
                    ====================== */}

                    <Route
                        path="/"
                        element={
                            <Home />
                        }
                    />

                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />

                    <Route
                        path="/register"
                        element={
                            <Register />
                        }
                    />

                    <Route
                        path="/blog"
                        element={
                            <Blog />
                        }
                    />

                    {seoPages.map((page) => (
                        <Route
                            key={page.path}
                            path={page.path}
                            element={
                                <SeoArticle />
                            }
                        />
                    ))}

                    {/* =====================
                        PROTECTED ROUTES
                    ====================== */}

                    <Route
                        element={
                            <ProtectedRoute />
                        }
                    >

                        <Route
                            path="/dashboard"
                            element={
                                <Dashboard />
                            }
                        />


                        <Route
                            path="/analyze"
                            element={
                                <Analyze />
                            }
                        />


                        <Route
                            path="/results"
                            element={
                              <Results />
                            }
                        />
                        <Route
                            path="/history"
                            element={
                              <History />
                            }
                        />

                    </Route>


                    {/* =====================
                        DEFAULT
                    ====================== */}

                    <Route
                        path="*"
                        element={
                            <Home />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );
}


export default App;