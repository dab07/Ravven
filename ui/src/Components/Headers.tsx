import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import '../css/App.css';

const Headers = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/profile', {
            method : 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProfile(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
    }, []);

    const logout = () => {
        fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include',
        })
            .then(() => {
                setProfile(null);
            })
            .catch(error => {
                console.error('Error logging out:', error);
            });
    };

    return (
        <div className="header">
            <Link to="/" className="logo">myBlog</Link>
            <div className="nav">
                {profile ? (
                    <>
                        <p>Welcome, {profile.username}</p>
                        <Link to ='/createpost'>Create Post</Link>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login">Login</Link>
                        <Link to="/signup" className="Signup">Signup</Link>
                    </>
                )}

            </div>
        </div>
    );
};

export default Headers;
