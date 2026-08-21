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

                    {/* Public */}

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


                    {/* Protected */}

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

                    </Route>


                    {/* Default */}

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