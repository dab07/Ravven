import './css/App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from 'react';
import Login from './Pages/Login';
import IndexPage from './Components/IndexPage';
import Signup from './Pages/Signup';
import Layout from './Components/Layout';
import {AuthProvider} from './Context/AuthContext';
import CreatePost from "./Components/CreatePost";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<IndexPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/createpost" element={<CreatePost/>}/>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
