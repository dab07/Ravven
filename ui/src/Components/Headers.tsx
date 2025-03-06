import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../css/App.css';
import { useAuth } from "../Context/AuthContext";

const Headers = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, user, logout , refreshProfile} = useAuth();

    // const getProfile = async () => {
    //     const token = localStorage.getItem('token');
    //     try {
    //         const response = await fetch("http://localhost:3000/profile", {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": token ? `Bearer ${token}` : ''
    //             },
    //             credentials: "include",
    //         });
    //         if (response.ok) {
    //             const data = await response.json();
    //             return data;
    //         } else {
    //             console.error("Network response was not ok");
    //         }
    //     } catch(error) {
    //         console.error('Error fetching profile:', error);
    //     }
    // };

    // useEffect(() => {
    //     refreshProfile();
    // }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="header">
            <Link to="/" className="logo">Ravven レベン</Link>
            <div className="nav">
                {isAuthenticated && user ? (
                    <>
                        <p>Welcome, {user.username}</p>
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
