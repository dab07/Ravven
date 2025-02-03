import './css/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import Login from './Components/Login';
import IndexPage from './Pages/IndexPage';
import Signup from './Components/Signup';
import Layout from './Components/Layout';
import {AuthProvider} from './Context/AuthContext'
import ProtectedRoute from './components/ProtectedRoutes';
const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout/>
                        </ProtectedRoute>
                    }>
                        <Route index element={<IndexPage />} />
                        <Route index path="/login" element={<Login str="Login" />} />
                        <Route path="/signup" element={<Signup str="Signup" />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
