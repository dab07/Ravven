import React from "react";
import { Link } from "react-router-dom";
import '../css/App.css';
import { useAuth } from "../Context/AuthContext";

const Headers = () => {
    const { isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        })
            .then(() => {
                logout();
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <div className="header">
            <Link to="/" className="logo">Ravven レベン</Link>
            <div className="nav">
                {isAuthenticated && user ? (
                    <>
                        <p>{user.username}</p>
                        <Link to='/createpost'>Create Post</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/signup">Signup</Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default Headers;
