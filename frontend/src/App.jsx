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


function App() {

    return (

        <BrowserRouter>

            <AuthProvider>

                <Routes>


                    {/* =====================
                        PUBLIC ROUTES
                    ====================== */}

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
                            <Login />
                        }
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>

    );
}


export default App;