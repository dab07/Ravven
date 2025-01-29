import './css/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import Login from './Components/Login';
import IndexPage from './Pages/IndexPage';
import Signup from './Components/Signup';
import Layout from './Components/Layout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<IndexPage />} />
                    <Route path="/login" element={<Login str="Login" />} />
                    <Route path="/signup" element={<Signup str="Signup" />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
