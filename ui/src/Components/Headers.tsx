import React from "react";
import { Link } from "react-router-dom";
import '../css/App.css';

const Headers = () => {
    return (
        <div className="header">
            <Link to="/" className="logo">myBlog</Link>
            <div className="nav">
                <Link to="/login" className="login">Login</Link>
                <Link to="/signup" className="Signup">Signup</Link>
            </div>
        </div>
    );
};

export default Headers;
